import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const UserService = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.post("/auth/refresh"),
  getAllUsers: () => api.get("/users"),
};

export const TodoService = {
  getAll: (params: any) => api.get("/todos", { params }),
  getOne: (id: number) => api.get(`/todos/${id}`),
  create: (data: any) => api.post("/todos", data),
  update: (id: number, data: any) => api.put(`/todos/${id}`, data),
  delete: (id: number) => api.delete(`/todos/${id}`),
  toggle: (id: number) => api.patch(`/todos/${id}/toggle`),
};
