import { useTodoState, useTodoDispatch } from "@/context/TodoContext";
import { Todo } from "@/types/todo";
import { TodoAction } from "@/context/TodoContext";

export function useTodos() {
  const todos = useTodoState();
  const dispatch = useTodoDispatch();

  // 依截止日期升序
  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  // CRUD 操作
  const addTodo = (todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) =>
    dispatch({ type: "ADD_TODO", payload: todo });
  const editTodo = (todo: Todo) => dispatch({ type: "EDIT_TODO", payload: todo });
  const deleteTodo = (id: string) => dispatch({ type: "DELETE_TODO", payload: id });
  const toggleTodo = (id: string) => dispatch({ type: "TOGGLE_TODO", payload: id });

  return {
    todos: sortedTodos,
    addTodo,
    editTodo,
    deleteTodo,
    toggleTodo,
    dispatch,
  };
}
