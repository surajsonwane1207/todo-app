import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const incomingRefreshToken = cookieStore.get("refreshToken")?.value || (await req.json()).refreshToken;

    if (!incomingRefreshToken) {
      return NextResponse.json({ message: "Unauthorized request" }, { status: 401 });
    }

    const decoded = verifyRefreshToken(incomingRefreshToken) as any;
    if (!decoded) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 });
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user.id });

    await db.update(users).set({ refreshToken: newRefreshToken }).where(eq(users.id, user.id));

    const response = NextResponse.json({
      message: "Token refreshed",
      data: { accessToken, refreshToken: newRefreshToken },
    }, { status: 200 });

    response.cookies.set("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
    response.cookies.set("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
