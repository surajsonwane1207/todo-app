import { NextResponse } from "next/server";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { verifyAccessToken } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const [updatedTodo] = await db.update(todos)
      .set({ completed: !todo.completed })
      .where(eq(todos.id, todo.id))
      .returning();

    return NextResponse.json({ message: "Todo toggled successfully", data: updatedTodo });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
