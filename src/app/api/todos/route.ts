import { NextResponse } from 'next/server';
import { getTodos, addTodo } from '@/app/api/todos/todoStore';
import { Todo } from '@/types/todo';

export async function GET() {
  return NextResponse.json(getTodos());
}

export async function POST(request: Request) {
  const newTodoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'completed'> = await request.json();
  const newTodo = addTodo(newTodoData);
  return NextResponse.json(newTodo, { status: 201 });
}