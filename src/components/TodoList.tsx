"use client";
import { useState, useEffect } from "react";
import { Todo } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";
import TodoForm from "@/components/TodoForm";
import { useTodos } from "@/hooks/useTodos";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TodoList() {
  const { todos, addTodo, editTodo, toggleTodo, deleteTodo } = useTodos();
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Todo | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");

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

  // 搜尋與過濾
  const filteredTodos = todos.filter(todo => {
    const matchKeyword = todo.title.toLowerCase().includes(search.toLowerCase()) || (todo.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = filter === "all" ? true : filter === "completed" ? todo.completed : !todo.completed;
    return matchKeyword && matchStatus;
  });

  function handleAdd() {
    setEditTarget(null);
    setOpen(true);
  }
  function handleEdit(todo: Todo) {
    setEditTarget(todo);
    setOpen(true);
  }
  function handleSubmit(data: any) {
    if (editTarget) {
      editTodo({ ...editTarget, ...data });
    } else {
      addTodo(data);
    }
    setOpen(false);
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="搜尋待辦..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>＋ 新增待辦</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editTarget ? "編輯待辦" : "新增待辦"}</DialogTitle>
            <TodoForm
              initial={editTarget || {}}
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      {filteredTodos.length === 0 ? (
        <div className="text-gray-400 text-center py-8">目前沒有符合條件的待辦事項</div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {filteredTodos.map((todo) => (
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
    </>
  );
}
