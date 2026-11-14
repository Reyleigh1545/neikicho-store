import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name, phone, address, role } = body;

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
      };

      const response = NextResponse.json({ success: true, user: safeUser });
      response.cookies.set("nekicho_session", JSON.stringify(safeUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    // Project rule: the test store does not create customer accounts (no emails or phone numbers collected).
    if (action === "register") {
      return NextResponse.json(
        { error: "Store thử nghiệm không cần tạo tài khoản. Bạn có thể đặt đơn thử ngay." },
        { status: 403 }
      );
    }

    if (action === "register_disabled") {
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: "Name, email and password are required" },
          { status: 400 }
        );
      }

      const existing = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          phone: phone || null,
          address: address || null,
          role: role === "ADMIN" ? "ADMIN" : "CUSTOMER",
        },
      });

      const safeUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
      };

      const response = NextResponse.json({ success: true, user: safeUser });
      response.cookies.set("nekicho_session", JSON.stringify(safeUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("nekicho_session");
      return response;
    }

    // One-click demo login removed: any visitor could become admin.
    if (action === "demo") {
      return NextResponse.json({ error: "Đã tắt đăng nhập nhanh." }, { status: 403 });
    }

    if (action === "demo_disabled") {
      const demoRole = role === "ADMIN" ? "ADMIN" : "CUSTOMER";
      const targetEmail =
        demoRole === "ADMIN" ? "admin@nekicho.com" : "customer@nekicho.com";

      const user = await prisma.user.findUnique({
        where: { email: targetEmail },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Demo user not found. Please run seed script." },
          { status: 404 }
        );
      }

      const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
      };

      const response = NextResponse.json({ success: true, user: safeUser });
      response.cookies.set("nekicho_session", JSON.stringify(safeUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("nekicho_session");
    if (!cookie?.value) {
      return NextResponse.json({ user: null });
    }

    const parsed = JSON.parse(cookie.value);
    // Double check user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: parsed.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
      },
    });

    return NextResponse.json({ user: user || null });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}

