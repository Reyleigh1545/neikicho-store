import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | string;
  phone?: string | null;
  address?: string | null;
}

/**
 * Extracts and verifies the current session user from incoming HTTP request cookies.
 */
export async function getCurrentUser(
  req: NextRequest
): Promise<SafeUser | null> {
  try {
    const sessionCookie = req.cookies.get("nekicho_session");
    if (!sessionCookie?.value) {
      return null;
    }

    const parsed = JSON.parse(sessionCookie.value);
    if (!parsed?.id) {
      return null;
    }

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

    return user;
  } catch (err) {
    return null;
  }
}

/**
 * Guard that verifies the user is logged in.
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ user: SafeUser } | NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required. Please sign in." },
      { status: 401 }
    );
  }
  return { user };
}

/**
 * Guard that verifies the user is an Administrator.
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ user: SafeUser } | NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required. Please sign in." },
      { status: 401 }
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden. Administrator privileges required." },
      { status: 403 }
    );
  }

  return { user };
}

