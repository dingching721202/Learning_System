export interface Todo {
  id: string;           // UUID
  title: string;
  description?: string;
  dueDate?: string;     // ISO 8601 e.g. "2025-07-10"，未指定可為 undefined
  time?: string;        // HH:mm (optional)
  completed: boolean;
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
