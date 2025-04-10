"use client";

import { useState, useEffect } from "react";
import { TodoList } from "./components/TodoList";
import { AddTodo } from "./components/AddTodo";
import { Todo } from "./types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch todos");
    }
  };

  const addTodo = async (title: string) => {
    const optimisticTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTodos((prev) => [optimisticTodo, ...prev]);

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        body: JSON.stringify({
          title,
          completed: false,
          userId: 1,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === optimisticTodo.id ? { ...data, id: optimisticTodo.id } : todo
        )
      );
      showNotification("Todo added successfully");
    } catch (error) {
      setTodos((prev) => prev.filter((todo) => todo.id !== optimisticTodo.id));
      showNotification("Failed to add todo", true);
    }
  };

  const deleteTodo = async (id: number) => {
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "DELETE",
      });
      showNotification("Todo deleted successfully");
    } catch (error) {
      setTodos(previousTodos);
      showNotification("Failed to delete todo", true);
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const previousTodos = [...todos];
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          completed: !todo.completed,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (error) {
      setTodos(previousTodos);
      showNotification("Failed to update todo", true);
    }
  };

  const showNotification = (message: string, isError = false) => {
    setError(isError ? message : null);
    if (!isError) {
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Todo App
          </h1>
          <p className="text-gray-400">
            Manage your tasks with this simple todo application.
          </p>
        </div>

        {error && (
          <div className={`p-4 rounded-lg ${
            error.includes('Failed') 
              ? 'bg-red-900/50 text-red-200 border border-red-700' 
              : 'bg-green-900/50 text-green-200 border border-green-700'
          }`}>
            {error}
          </div>
        )}

        <AddTodo onAdd={addTodo} />
        <TodoList todos={todos} onDelete={deleteTodo} onToggle={toggleTodo} />
      </div>
    </div>
  );
}