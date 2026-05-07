import { NextResponse } from "next/server";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { verifyAccessToken } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const decoded = verifyAccessToken(token!) as any;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const todo = await db.query.todos.findFirst({
      where: and(eq(todos.id, parseInt(id)), eq(todos.userId, decoded.id)),
    });

    if (!todo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo fetched successfully", data: todo });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const decoded = verifyAccessToken(token!) as any;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, priority, dueDate, completed } = await req.json();

    const [updatedTodo] = await db.update(todos)
      .set({ title, description, priority, dueDate, completed })
      .where(and(eq(todos.id, parseInt(id)), eq(todos.userId, decoded.id)))
      .returning();

    if (!updatedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo updated successfully", data: updatedTodo });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const decoded = verifyAccessToken(token!) as any;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await db.delete(todos)
      .where(and(eq(todos.id, parseInt(id)), eq(todos.userId, decoded.id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
