import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Please Add All Fields" }, { status: 400 });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ message: "User Already Exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role,
    }).returning();

    const accessToken = generateAccessToken({ id: newUser.id, email: newUser.email, role: newUser.role });
    const refreshToken = generateRefreshToken({ id: newUser.id });

    await db.update(users).set({ refreshToken }).where(eq(users.id, newUser.id));

    const response = NextResponse.json({
      message: "User registered successfully",
      data: {
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        accessToken,
        refreshToken,
      },
    }, { status: 201 });

    response.cookies.set("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
    response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
