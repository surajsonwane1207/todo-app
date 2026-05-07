"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/features/store";
import { TodoList } from "@/components/TodoList";
import { NewTodo } from "@/components/NewTodo";
import { Stats } from "@/components/Stats";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back, {user?.name}! Here's an overview of your tasks.
            </p>
          </div>

          <Stats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <section className="lg:col-span-1 sticky top-8">
              <NewTodo />
            </section>

            <section className="lg:col-span-2">
              <TodoList />
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
