import { NextResponse } from "next/server";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { verifyAccessToken } from "@/lib/auth";
import { eq, and, like, or } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const decoded = verifyAccessToken(token!) as any;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const whereConditions: any[] = [eq(todos.userId, decoded.id)];

    if (search) {
      whereConditions.push(or(like(todos.title, `%${search}%`), like(todos.description, `%${search}%`)));
    }

    if (status === "completed") whereConditions.push(eq(todos.completed, true));
    if (status === "pending") whereConditions.push(eq(todos.completed, false));
    if (priority) whereConditions.push(eq(todos.priority, priority as any));

    const allTodos = await db.query.todos.findMany({
      where: and(...whereConditions),
      limit,
      offset,
      orderBy: (todos, { desc }) => [desc(todos.createdAt)],
    });

    const totalCount = await db.query.todos.findMany({
      where: and(...whereConditions),
    });

    return NextResponse.json({
      message: "Todos fetched successfully",
      data: {
        todos: allTodos,
        pagination: {
          totalTodos: totalCount.length,
          totalPages: Math.ceil(totalCount.length / limit),
          currentPage: page,
          limit,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const decoded = verifyAccessToken(token!) as any;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, priority, dueDate } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ message: "Please Add All Fields" }, { status: 400 });
    }

    const [newTodo] = await db.insert(todos).values({
      title,
      description,
      priority: priority || "medium",
      dueDate: dueDate || null,
      userId: decoded.id,
    }).returning();

    return NextResponse.json({ message: "Todo added successfully", data: newTodo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
