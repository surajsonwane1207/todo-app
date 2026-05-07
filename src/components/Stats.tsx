"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/features/store";

export const Stats = () => {
  const todos = useSelector((state: RootState) => state.todo.todos);

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter((t) => t.priority === "high").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <span className="text-gray-500 text-sm font-medium">Total Tasks</span>
        <span className="text-3xl font-bold text-gray-800">{total}</span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <span className="text-gray-500 text-sm font-medium">Completed</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-green-600">{completed}</span>
          <span className="text-sm text-gray-400">({completionRate}%)</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <span className="text-gray-500 text-sm font-medium">Pending</span>
        <span className="text-3xl font-bold text-amber-500">{pending}</span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <span className="text-gray-500 text-sm font-medium">High Priority</span>
        <span className="text-3xl font-bold text-red-500">{highPriority}</span>
      </div>
    </div>
  );
};
