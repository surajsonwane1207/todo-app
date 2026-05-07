"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { editTodo as editTodoAction } from "@/features/todo/todoSlice";
import { TodoService } from "@/services/api";
import toast from "react-hot-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function EditTodoPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    completed: false,
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await TodoService.getOne(parseInt(id as string));
        const data = response.data.data;
        setTodo({
          title: data.title,
          description: data.description,
          completed: data.completed,
          priority: data.priority || "medium",
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
        });
      } catch (error) {
        toast.error("Failed to load task details.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchTodo();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTodo((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo.title || !todo.description) {
      toast.error("Please provide both title and description");
      return;
    }
    try {
      const response = await TodoService.update(parseInt(id as string), todo);
      dispatch(editTodoAction(response.data.data));
      toast.success("Task updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
    }
  };

  if (loading) return <div className="flex justify-center my-8">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Edit Todo</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={todo.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={todo.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={todo.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={todo.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="completed"
                id="completed"
                checked={todo.completed}
                onChange={(e) => setTodo((prev) => ({ ...prev, completed: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="completed" className="ml-2 block text-sm text-gray-900 font-medium">
                Mark as Completed
              </label>
            </div>
            <div className="flex space-x-4 pt-4 border-t">
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition shadow-sm active:scale-95"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
