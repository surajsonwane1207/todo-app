"use client";

import { useDispatch } from "react-redux";
import { toggleTodo as toggleTodoAction, deleteTodo as deleteTodoAction } from "@/features/todo/todoSlice";
import { TodoService } from "@/services/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface TodoProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string | null;
}

export const Todo = ({ id, title, description, completed, priority, dueDate }: TodoProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleToggle = async () => {
    try {
      await TodoService.toggle(id);
      dispatch(toggleTodoAction({ id, title, description, completed, priority, dueDate } as any));
      toast.success(`Task marked as ${!completed ? "completed" : "incomplete"}`);
    } catch (error) {
      toast.error("Failed to update task status.");
    }
  };

  const handleDelete = async () => {
    try {
      if (!confirm("Are you sure you want to delete this todo?")) return;
      await TodoService.delete(id);
      dispatch(deleteTodoAction({ id }));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-xl font-bold ${completed ? "line-through text-gray-400" : "text-gray-800"}`}>
              {title}
            </h3>
            {priority && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getPriorityColor(
                  priority
                )}`}
              >
                {priority}
              </span>
            )}
          </div>
          <p className="text-gray-600 line-clamp-2">{description}</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => router.push(`/edit/${id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
            title="Edit Todo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
            title="Delete Todo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
              completed
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${completed ? "bg-green-500" : "bg-gray-400"}`}></span>
            {completed ? "Completed" : "Mark Complete"}
          </button>

          {dueDate && (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <span className="text-[10px] text-gray-400 font-mono">#{id.toString().padStart(6, "0")}</span>
      </div>
    </div>
  );
};
