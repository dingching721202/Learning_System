"use client";
import { Todo } from "@/types/todo";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { format, isBefore, parseISO } from "date-fns";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const dueDate = todo.dueDate ? parseISO(todo.dueDate) : undefined;
  const isOverdue = !todo.completed && dueDate && isBefore(dueDate, new Date());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingField, setEditingField] = useState<"date"|"time"|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <li
      className={cn(
        "flex items-center gap-3 p-3 rounded transition-colors border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-[#232a36] dark:hover:text-white",
        todo.completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label="完成待辦"
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(todo)}>
        <div
          className={cn(
            "font-medium text-base truncate text-black dark:text-white",
            todo.completed && "line-through text-gray-400"
          )}
        >
          {todo.title}
          {(todo.time || todo.dueDate) && (
            <span
              style={{
                marginLeft: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {todo.dueDate && (
                <span
                  tabIndex={0}
                  style={{
                    borderRadius: '0.7em',
                    border: isOverdue ? '1.2px solid #e53935' : '1.2px solid #43a047',
                    background: isOverdue ? '#ffebee' : '#e8f5e9',
                    color: isOverdue ? '#e53935' : '#388e3c',
                    fontSize: '0.95em',
                    fontWeight: 400,
                    padding: '0 0.5em',
                    marginRight: 4,
                    display: 'inline-block',
                    cursor: 'pointer',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setEditingField("date");
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                        inputRef.current.click();
                      }
                    }, 0);
                  }}
                  title="點擊修改截止日期"
                >
                  {editingField === "date" ? (
                    <input
                      ref={inputRef}
                      type="date"
                      value={todo.dueDate}
                      min={format(new Date(), "yyyy-MM-dd")}
                      style={{
                        fontSize: '0.95em',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        color: isOverdue ? '#e53935' : '#388e3c',
                        width: 110,
                      }}
                      onBlur={() => setEditingField(null)}
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        setEditingField(null);
                        onEdit({ ...todo, dueDate: e.target.value });
                      }}
                    />
                  ) : (
                    dueDate ? format(dueDate, "yyyy-MM-dd") : ""
                  )}
                </span>
              )}
              {todo.time && (
                <span
                  tabIndex={0}
                  style={{
                    borderRadius: '0.7em',
                    border: isOverdue ? '1.2px solid #e53935' : '1.2px solid #90caf9',
                    background: isOverdue ? '#ffebee' : '#e3f2fd',
                    color: isOverdue ? '#e53935' : '#1976d2',
                    fontSize: '0.95em',
                    fontWeight: 400,
                    padding: '0 0.5em',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setEditingField("time");
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                        inputRef.current.click();
                      }
                    }, 0);
                  }}
                  title="點擊修改時間"
                >
                  {editingField === "time" ? (
                    <input
                      ref={inputRef}
                      type="time"
                      value={todo.time}
                      step="60"
                      inputMode="numeric"
                      pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                      style={{
                        fontSize: '0.95em',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        color: isOverdue ? '#e53935' : '#1976d2',
                        width: 70,
                      }}
                      onBlur={() => setEditingField(null)}
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        setEditingField(null);
                        onEdit({ ...todo, time: e.target.value });
                      }}
                    />
                  ) : (
                    todo.time && /^\d{2}:\d{2}$/.test(todo.time)
                      ? todo.time
                      : (todo.time ? (todo.time.length === 5 ? todo.time : ("0" + todo.time).slice(-5)) : "")
                  )}
                </span>
              )}
            </span>
          )}
        </div>
        {todo.description && (
          <div className="text-xs text-gray-500 truncate">
            {todo.description}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="編輯"
        onClick={() => onEdit(todo)}
        className="text-blue-500 hover:bg-blue-100 dark:hover:bg-[#334155] dark:hover:text-white"
      >
        <span className="material-symbols-outlined">edit</span>
      </Button>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="刪除"
            className="text-red-500 hover:bg-red-100 dark:hover:bg-[#7f1d1d] dark:hover:text-white"
          >
            <span className="material-symbols-outlined">delete</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>確定要刪除這個待辦嗎？</DialogTitle>
          <div className="text-sm text-gray-500 mb-4">「{todo.title}」將被永久刪除，無法復原。</div>
          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button variant="ghost">取消</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(todo.id);
                setDeleteOpen(false);
              }}
            >
              確認刪除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </li>
  );
}
