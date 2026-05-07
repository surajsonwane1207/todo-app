"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { LogoutButton } from "./LogoutButton";

export const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-black text-blue-600 tracking-tighter">
                TODO<span className="text-gray-400">APP</span>
              </h1>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              href="/"
              className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium transition"
            >
              Home
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium transition"
              >
                Dashboard
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium transition font-bold"
              >
                Admin
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 hidden md:block">
                  Welcome, <span className="font-semibold text-gray-800">{user.name}</span>
                </span>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
