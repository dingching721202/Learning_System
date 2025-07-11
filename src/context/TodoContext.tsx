"use client";
import React, { createContext, useReducer, useContext, ReactNode, useEffect, useCallback, useMemo } from "react";
import { Todo } from "@/types/todo";

// Action Types
export type TodoAction =
  | { type: "SET_TODOS"; payload: Todo[] };

// Define the type for the dispatch functions that will interact with the API
export type TodoDispatch = {
  addTodo: (newTodoData: Omit<Todo, "id" | "createdAt" | "updatedAt" | "completed">) => Promise<void>;
  editTodo: (updatedTodo: Todo) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
};

// Reducer
function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "SET_TODOS":
      return action.payload;
    default:
      return state;
  }
}

// Context
const TodoStateContext = createContext<Todo[] | undefined>(undefined);
const TodoDispatchContext = createContext<TodoDispatch | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(todoReducer, []);

  // Function to fetch todos from API and update state
  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Todo[] = await response.json();
      dispatch({ type: "SET_TODOS", payload: data });
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      // Fallback to localStorage if API fails on initial load
      const local = typeof window !== "undefined" ? localStorage.getItem("todos") : null;
      if (local) {
        try {
          const parsed = JSON.parse(local);
          dispatch({ type: "SET_TODOS", payload: parsed });
        } catch (e) {
          console.error("Failed to parse localStorage todos:", e);
          dispatch({ type: "SET_TODOS", payload: [] }); // Fallback to empty array
        }
      } else {
        dispatch({ type: "SET_TODOS", payload: [] }); // Fallback to empty array
      }
    }
  }, []);

  // Initial load from API or localStorage
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Sync localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(state));
    }
  }, [state]);

  // API interaction functions
  const addTodo = useCallback(async (newTodoData: Omit<Todo, "id" | "createdAt" | "updatedAt" | "completed">) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodoData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchTodos(); // Re-fetch all todos to update state
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  }, [fetchTodos]);

  const editTodo = useCallback(async (updatedTodo: Todo) => {
    try {
      const response = await fetch(`/api/todos/${updatedTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchTodos();
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
  }, [fetchTodos]);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }, [fetchTodos]);

  const toggleTodo = useCallback(async (id: string) => {
    const todoToToggle = state.find(todo => todo.id === id);
    if (!todoToToggle) return;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todoToToggle.completed }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchTodos();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  }, [state, fetchTodos]);

  const todoDispatch: TodoDispatch = useMemo(() => ({
    addTodo,
    editTodo,
    deleteTodo,
    toggleTodo,
  }), [addTodo, editTodo, deleteTodo, toggleTodo]);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={todoDispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
};

export function useTodoState() {
  const context = useContext(TodoStateContext);
  if (context === undefined) throw new Error("useTodoState must be used within a TodoProvider");
  return context;
}

export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (context === undefined) throw new Error("useTodoDispatch must be used within a TodoProvider");
  return context;
}
