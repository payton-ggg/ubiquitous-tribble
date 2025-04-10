"use client";

import { Trash2 } from "lucide-react";
import { Todo } from "../types/todo";

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export function TodoList({ todos, onDelete, onToggle }: TodoListProps) {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-600 group"
        >
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <span className={`${
              todo.completed 
                ? 'line-through text-gray-500' 
                : 'text-gray-100'
              } transition-colors duration-200`}>
              {todo.title}
            </span>
          </div>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-gray-400 hover:text-red-400 rounded-full transition-colors duration-200 hover:bg-red-900/20 group-hover:opacity-100 opacity-0"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}