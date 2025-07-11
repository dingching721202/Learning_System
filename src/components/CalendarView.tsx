"use client";
import { useState, useEffect } from "react";
// @ts-ignore
const {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} = require("@dnd-kit/core");
// @ts-ignore
const {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} = require("@dnd-kit/sortable");
import UnscheduledTodos from "@/components/UnscheduledTodos";
import Calendar from "react-calendar";
import { FC } from "react";
import { useTodos } from "@/hooks/useTodos";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import "react-calendar/dist/Calendar.css";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { TodoItem } from "@/components/TodoItem";
import TodoForm from "@/components/TodoForm";
import { Button } from "@/components/ui/button";

export default function CalendarView() {
  const { todos, addTodo, editTodo, toggleTodo, deleteTodo } = useTodos();
  const [value, setValue] = useState<Date | null>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  // 新增搜尋與過濾狀態
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");

  // 搜尋與過濾
  const filteredTodos = todos.filter(todo => {
    const matchKeyword = todo.title.toLowerCase().includes(search.toLowerCase()) || (todo.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = filter === "all" ? true : filter === "completed" ? todo.completed : !todo.completed;
    return matchKeyword && matchStatus;
  });

  // 依日期分組
  const todosByDate = filteredTodos.reduce<Record<string, typeof filteredTodos>>((acc, todo) => {
    const key = todo.dueDate || "unscheduled";
    if (!acc[key]) acc[key] = [];
    acc[key].push(todo);
    return acc;
  }, {});

  // 未訂日期區
  const unscheduledTodos = todosByDate["unscheduled"] || [];

  function handleDayClick(date: Date) {
    setSelectedDate(format(date, "yyyy-MM-dd"));
    setEditTarget(null);
    setDialogOpen(true);
  }
  function handleAdd() {
    setEditTarget({ dueDate: selectedDate });
  }
  function handleEdit(todo: any) {
    setEditTarget(todo);
    setDialogOpen(true);
  }
  function handleSubmit(data: any) {
    if (editTarget && editTarget.id) {
      editTodo({ ...editTarget, ...data });
    } else {
      addTodo({ ...data, dueDate: selectedDate });
    }
    setEditTarget(null);
  }

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // dnd-kit 拖曳結構
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // 解析 droppableId: 格式 calendar-2025-07-09 或 unscheduled
    const [fromType, fromKey] = (active.data.current?.droppableId || '').split(':');
    const [toType, toKey] = (over.data.current?.droppableId || '').split(':');
    const todo = todos.find(t => t.id === active.id);
    if (!todo) return;
    // 未訂日期區 droppableId: unscheduled
    const toDate = toType === 'calendar' ? toKey : undefined;
    editTodo({ ...todo, dueDate: toDate });
  }

  // 日曆格子元件，頂層呼叫 dnd-kit hooks
  // 月曆格子只顯示純展示（不可互動）
  const CalendarTile: FC<{ date: Date; dayTodos: any[] }> = ({ date, dayTodos }) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useDroppable, useDraggable } = require("@dnd-kit/core");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SortableContext, verticalListSortingStrategy } = require("@dnd-kit/sortable");
    const key = format(date, "yyyy-MM-dd");
    const { setNodeRef } = useDroppable({ id: `calendar:${key}`, data: { droppableId: `calendar:${key}` } });
    // 只顯示最早的2個，超過顯示+N
    const maxShow = 2;
    const showTodos = dayTodos.slice(0, maxShow);
    const moreCount = dayTodos.length - maxShow;
    return (
      <div ref={setNodeRef} className="flex flex-col gap-1 min-h-[2.5rem]">
        <SortableContext items={dayTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {showTodos.map(todo => {
            const { attributes, listeners, setNodeRef: setDraggableRef, transform, transition, isDragging } = useDraggable({
              id: todo.id,
              data: { droppableId: `calendar:${key}` }
            });
            // 純展示：只顯示標題與狀態色塊，不渲染 button/checkbox
            return (
              <div
                key={todo.id}
                ref={setDraggableRef}
                style={{
                  transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : undefined,
                  transition,
                  opacity: isDragging ? 0.5 : 1,
                  background: todo.completed ? '#f3f4f6' : '#fff',
                  borderRadius: '0.5em',
                  border: todo.completed ? '1.5px solid #d1d5db' : '1.5px solid #60a5fa',
                  color: '#222',
                  fontWeight: 500,
                  fontSize: '0.98em',
                  padding: '0.25em 0.7em',
                  marginBottom: 2,
                  textDecoration: todo.completed ? 'line-through' : undefined,
                  cursor: 'grab',
                  userSelect: 'none',
                  boxShadow: isDragging ? '0 2px 8px #0002' : undefined,
                  zIndex: isDragging ? 1000 : undefined,
                  position: isDragging ? 'relative' : undefined,
                }}
                {...attributes}
                {...listeners}
                title={todo.title}
              >
                {todo.title}
              </div>
            );
          })}
          {moreCount > 0 && (
            <div className="text-xs text-blue-500 font-semibold rounded bg-blue-50 px-2 py-0.5 mt-1 w-fit select-none">+{moreCount}</div>
          )}
        </SortableContext>
      </div>
    );
  };

  // 主題切換
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      {/* 右上角主題切換按鈕 */}
      <div className="fixed top-4 right-8 z-50">
        <button
          aria-label="切換主題"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="transition-colors rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md p-2 hover:bg-blue-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {theme === 'dark' ? (
            // 太陽 icon
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95-1.41-1.41M6.46 6.46 5.05 5.05m13.9 0-1.41 1.41M6.46 17.54l-1.41 1.41"/></svg>
          ) : (
            // 月亮 icon
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
          )}
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* 搜尋/過濾列，置中於月曆區塊上方 */}
        <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center gap-2 mb-4 px-2">
          <div className="flex gap-2 items-center w-full md:w-auto justify-center">
            <input
              type="text"
              placeholder="搜尋待辦..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ minWidth: 120 }}
            />
            <div className="flex gap-1 ml-2">
              <button
                className={`px-2 py-1 rounded text-xs font-medium border ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} hover:bg-blue-100`}
                onClick={() => setFilter('all')}
              >全部</button>
              <button
                className={`px-2 py-1 rounded text-xs font-medium border ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} hover:bg-blue-100`}
                onClick={() => setFilter('active')}
              >未完成</button>
              <button
                className={`px-2 py-1 rounded text-xs font-medium border ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} hover:bg-blue-100`}
                onClick={() => setFilter('completed')}
              >已完成</button>
            </div>
          </div>
        </div>
        {/* 主內容區域 */}
        <div className="flex flex-col md:flex-row w-full mx-auto gap-8 items-start min-h-[80vh] justify-center pt-0" style={{width: '100%'}}>
          {/* 桌機左側，手機上方 */}
          <div className="md:w-[300px] w-full md:shrink-0 md:static md:self-start pt-0 z-10">
            <UnscheduledTodos
              todos={unscheduledTodos}
              onEdit={handleEdit}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onAdd={() => {
                setSelectedDate("");
                setEditTarget({ dueDate: undefined });
                setDialogOpen(true);
              }}
            />
          </div>
          <div className="flex-1 w-full flex justify-center md:pl-0 pt-0 z-0">
            <div className="w-full max-w-[900px]">
              <Calendar
                value={value}
                onChange={(value) => {
                  // value: Date | [Date, Date] | null
                  if (Array.isArray(value)) {
                    setValue(value[0] ?? new Date());
                  } else {
                    setValue(value ?? new Date());
                  }
                }}
                onClickDay={handleDayClick}
                tileContent={({ date }: { date: Date }) => {
                  const key = format(date, "yyyy-MM-dd");
                  const dayTodos = todosByDate[key] || [];
                  return (
                    <CalendarTile
                      date={date}
                      dayTodos={dayTodos}
                    />
                  );
                }}
                tileClassName={({ date }: { date: Date }) => {
                  const key = format(date, "yyyy-MM-dd");
                  const dayTodos = todosByDate[key] || [];
                  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                  if (dayTodos.every(t => t.completed) && dayTodos.length > 0) return "opacity-60 grayscale" + (isToday ? " calendar-today" : "");
                  // 再加高以容納3列且更舒適
                  return "!h-32 min-h-[9.5rem] max-h-[9.5rem] flex flex-col justify-center" + (isToday ? " calendar-today" : "");
                }}
                className="w-full mx-auto border-none shadow-none bg-transparent rwd-calendar"
                calendarType="gregory"
                locale="zh-TW"
              />
            </div>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogTitle>
              {selectedDate} 待辦事項
              <Button className="ml-2" size="sm" onClick={handleAdd}>
                ＋ 新增
              </Button>
            </DialogTitle>
            {editTarget ? (
              <TodoForm
                initial={editTarget}
                onSubmit={handleSubmit}
                onCancel={() => setEditTarget(null)}
              />
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800 mt-2">
                {(todosByDate[selectedDate] || []).length === 0 && (
                  <div className="text-gray-400 text-center py-4">當日沒有待辦</div>
                )}
                {(todosByDate[selectedDate] || []).map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onEdit={handleEdit}
                    onDelete={deleteTodo}
                  />
                ))}
              </ul>
            )}
          </DialogContent>
        </Dialog>
      </DndContext>
    </>
  );
}
