import { NextResponse } from 'next/server';
import { Todo } from '@/types/todo';
import { getTodoById, updateTodo, patchTodo, deleteTodo } from '@/app/api/todos/todoStore';

// GET /api/todos/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const todo = getTodoById(id);

  if (todo) {
    return NextResponse.json(todo);
  } else {
    return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
  }
}

// PUT /api/todos/[id] (Full update)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const updatedTodoData: Todo = await request.json();
  const updated = updateTodo(id, updatedTodoData);

  if (updated) {
    return NextResponse.json(updated);
  } else {
    return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
  }
}

// PATCH /api/todos/[id] (Partial update)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const partialUpdate: Partial<Todo> = await request.json();
  const updated = patchTodo(id, partialUpdate);

  if (updated) {
    return NextResponse.json(updated);
  } else {
    return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
  }
}

// DELETE /api/todos/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const deleted = deleteTodo(id);

  if (deleted) {
    return new NextResponse(null, { status: 204 }); // No Content
  } else {
    return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
  }
}