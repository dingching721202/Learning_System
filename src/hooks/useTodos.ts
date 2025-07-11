import { useTodoState, useTodoDispatch } from "@/context/TodoContext";
import { Todo } from "@/types/todo";

export function useTodos() {
  const todos = useTodoState();
  const { addTodo, editTodo, deleteTodo, toggleTodo } = useTodoDispatch();

  // 依截止日期升序
  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  return {
    todos: sortedTodos,
    addTodo,
    editTodo,
    deleteTodo,
    toggleTodo,
  };
}
