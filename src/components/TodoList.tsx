"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/features/store";
import { setTodos } from "@/features/todo/todoSlice";
import { TodoService } from "@/services/api";
import { Todo } from "./Todo";
import { Pagination } from "./Pagination";
import toast from "react-hot-toast";

export const TodoList = () => {
  const todos = useSelector((state: RootState) => state.todo.todos);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTodos: 0,
    limit: 10,
  });

  const fetchTodos = async (page = 1) => {
    setLoading(true);
    try {
      const response = await TodoService.getAll({
        limit: 10,
        page,
        search,
        status,
        priority,
      });
      if (response && response.data) {
        dispatch(setTodos(response.data.data.todos));
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTodos(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, status, priority]);

  useEffect(() => {
    fetchTodos(pagination.currentPage);
  }, [pagination.currentPage, todos.length]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col mb-6 gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">My Todos</h2>
          <span className="text-sm text-gray-500 font-medium">{pagination.totalTodos} tasks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white transition"
          >
            <option value="">All Status</option>
            <option value="completed">Completed Only</option>
            <option value="pending">Pending Only</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white transition"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>
      {loading && todos.length === 0 ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {todos.length > 0 ? (
            <ul className="space-y-4">
              {todos.map((todo) => (
                <li key={todo.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <Todo {...todo} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 my-8">No todos found. Add one above!</p>
          )}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
