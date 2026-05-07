"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "@/features/todo/todoSlice";
import { TodoService } from "@/services/api";
import toast from "react-hot-toast";

export const NewTodo = () => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    completed: false,
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTodo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo.title || !todo.description) {
      toast.error("Please provide both title and description");
      return;
    }
    try {
      const response = await TodoService.create(todo);
      if (response && response.data) {
        dispatch(addTodo(response.data.data));
        toast.success("Task added successfully!");
        setTodo({
          title: "",
          description: "",
          completed: false,
          priority: "medium",
          dueDate: "",
        });
        setIsExpanded(false);
      }
    } catch (error) {
      toast.error("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="p-4 cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition"
        >
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-gray-500 font-medium">Create a new task...</span>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Add New Task</h3>
            <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={todo.title}
                onChange={handleChange}
                placeholder="What needs to be done?"
                className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={todo.description}
                onChange={handleChange}
                placeholder="Add more details..."
                className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={todo.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={todo.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition shadow-sm active:transform active:scale-95"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
