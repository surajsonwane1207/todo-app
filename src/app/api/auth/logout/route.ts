import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    const user = await db.query.users.findFirst({
      where: eq(users.refreshToken, refreshToken),
    });

    if (user) {
      await db.update(users).set({ refreshToken: null }).where(eq(users.id, user.id));
    }
  }

  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}
