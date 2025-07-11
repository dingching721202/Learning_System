"use client";
import { useState, useRef, useEffect } from "react";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, isBefore, parseISO } from "date-fns";

export type TodoFormProps = {
  initial?: Partial<Todo> & { _focus?: 'time' | 'dueDate' };
  onSubmit: (data: Omit<Todo, "id" | "createdAt" | "updatedAt" | "completed">) => void;
  onCancel?: () => void;
};

export default function TodoForm({ initial = {}, onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [dueDate, setDueDate] = useState(initial.dueDate || "");
  const [time, setTime] = useState(initial.time || "");
  const [error, setError] = useState("");
  const dueDateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // 若 initial 有 _focus 欄位，聚焦對應 input
  useEffect(() => {
    if (initial && initial._focus === 'time' && timeInputRef.current) {
      timeInputRef.current.focus();
    }
    if (initial && initial._focus === 'dueDate' && dueDateInputRef.current) {
      dueDateInputRef.current.focus();
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("標題為必填");
      return;
    }
    // 許 dueDate 為空（未訂日期區），但若有填則需驗證
    if (dueDate) {
      const today = format(new Date(), "yyyy-MM-dd");
      if (dueDate < today) {
        setError("截止日不可早於今天");
        return;
      }
    }
    // 格式化日期 yyyy-MM-dd，時間 HH:mm（補零）
    const pad = (n: string | number) => n.toString().padStart(2, '0');
    let formattedDate = '';
    let formattedTime = '';
    if (dueDate) {
      // 保持與 time 一致，直接用 input value（yyyy-MM-dd）
      formattedDate = dueDate;
    }
    if (time) {
      const [h, m] = time.split(":");
      formattedTime = `${pad(h)}:${pad(m)}`;
    }
    onSubmit({ title: title.trim(), description: description.trim(), dueDate: dueDate ? formattedDate : undefined, time: formattedTime });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="title">標題 <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          maxLength={50}
          autoFocus
        />
      </div>
      {/* 上方截止日期欄位移除 */}
      <div>
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={200}
          rows={3}
        />
      </div>
      <div>
        <label htmlFor="dueDate" style={{ cursor: 'pointer', display: 'block', fontWeight: 'normal', marginBottom: 4 }}>
          截止日期
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
            ref={dueDateInputRef}
            style={{ cursor: 'pointer', marginTop: 4 }}
            placeholder="未指定則為未訂日期區"
          />
        </label>
        <div className="mt-2">
          <label htmlFor="time" style={{ cursor: 'pointer', display: 'block', fontWeight: 'normal', marginBottom: 4 }}>
            時間
            <Input
              id="time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              step="60"
              ref={timeInputRef}
              style={{ cursor: 'pointer', marginTop: 4 }}
              inputMode="numeric"
              pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
            />
          </label>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            取消
          </Button>
        )}
        <Button type="submit">儲存</Button>
      </div>
    </form>
  );
}
