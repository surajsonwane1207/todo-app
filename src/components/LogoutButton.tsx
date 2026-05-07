"use client";

import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { UserService } from "@/services/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await UserService.logout();
      dispatch(logout());
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
    >
      Logout
    </button>
  );
};
