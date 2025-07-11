import { Todo } from '@/types/todo';
import { sampleTodos } from '@/types/sampleTodos';

// In-memory store for todos
// In a real application, this would be a database
let todos: Todo[] = [...sampleTodos]; // Initialize with sample data

export function getTodos(): Todo[] {
  return todos;
}

export function getTodoById(id: string): Todo | undefined {
  return todos.find(t => t.id === id);
}

export function addTodo(newTodoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'completed'>): Todo {
  const now = new Date().toISOString();
  const newTodo: Todo = {
    ...newTodoData,
    id: crypto.randomUUID(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  todos.unshift(newTodo);
  return newTodo;
}

export function updateTodo(id: string, updatedTodoData: Todo): Todo | undefined {
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex !== -1) {
    const now = new Date().toISOString();
    todos[todoIndex] = { ...updatedTodoData, updatedAt: now };
    return todos[todoIndex];
  }
  return undefined;
}

export function patchTodo(id: string, partialUpdate: Partial<Todo>): Todo | undefined {
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex !== -1) {
    const now = new Date().toISOString();
    todos[todoIndex] = { ...todos[todoIndex], ...partialUpdate, updatedAt: now };
    return todos[todoIndex];
  }
  return undefined;
}

export function deleteTodo(id: string): boolean {
  const initialLength = todos.length;
  todos = todos.filter(t => t.id !== id);
  return todos.length < initialLength;
}