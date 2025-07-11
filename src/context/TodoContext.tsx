"use client";
import React, { createContext, useReducer, useContext, Dispatch, ReactNode, useEffect } from "react";
import { Todo } from "@/types/todo";
import { sampleTodos } from "@/types/sampleTodos";

// Action Types
export type TodoAction =
  | { type: "ADD_TODO"; payload: Omit<Todo, "id" | "createdAt" | "updatedAt"> }
  | { type: "EDIT_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "INIT_TODOS"; payload: Todo[] };

// Reducer
function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "INIT_TODOS":
      return action.payload;
    case "ADD_TODO": {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        ...action.payload,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      return [newTodo, ...state];
    }
    case "EDIT_TODO":
      return state.map(todo =>
        todo.id === action.payload.id ? { ...action.payload, updatedAt: new Date().toISOString() } : todo
      );
    case "DELETE_TODO":
      return state.filter(todo => todo.id !== action.payload);
    case "TOGGLE_TODO":
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() } : todo
      );
    default:
      return state;
  }
}

// Context
const TodoStateContext = createContext<Todo[] | undefined>(undefined);
const TodoDispatchContext = createContext<Dispatch<TodoAction> | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(todoReducer, []);

  // 初始化 sample data 或 localStorage
  useEffect(() => {
    const local = typeof window !== "undefined" ? localStorage.getItem("todos") : null;
    if (local) {
      try {
        const parsed = JSON.parse(local);
        dispatch({ type: "INIT_TODOS", payload: parsed });
      } catch {
        dispatch({ type: "INIT_TODOS", payload: sampleTodos });
      }
    } else {
      dispatch({ type: "INIT_TODOS", payload: sampleTodos });
    }
  }, []);

  // 同步 localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(state));
    }
  }, [state]);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
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
