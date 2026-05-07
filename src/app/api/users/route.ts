import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const decoded = verifyAccessToken(token!) as any;

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allUsers = await db.query.users.findMany({
      columns: {
        password: false,
        refreshToken: false,
      },
    });

    return NextResponse.json({ message: "Users fetched successfully", data: allUsers });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
