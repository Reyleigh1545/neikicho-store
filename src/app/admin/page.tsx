import React from "react";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

async function isAdminSession(): Promise<boolean> {
  try {
    const raw = cookies().get("nekicho_session")?.value;
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed?.id) return false;
    const user = await prisma.user.findUnique({
      where: { id: parsed.id },
      select: { role: true },
    });
    return user?.role === "ADMIN";
  } catch {
    return false;
  }
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Only the team (admin account) can see test orders
  if (!(await isAdminSession())) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
        <h1 className="text-2xl font-bold text-nekicho-text">Trang dành cho nhóm</h1>
        <p className="text-sm text-nekicho-muted">Vui lòng đăng nhập bằng tài khoản admin của nhóm.</p>
        <Link href="/auth/login" className="inline-block px-5 py-2.5 bg-nekicho-primary text-white rounded-full text-xs font-bold">
          Đăng nhập
        </Link>
      </div>
    );
  }

  const [orders, products, categories] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-nekicho-subtle text-nekicho-primary text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Store Administrator Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-nekicho-text">
            NekiCho Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-nekicho-muted mt-1">
            Real-time management of client orders, custom gift boxes, inventory, and asset replacement.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-nekicho-bg border border-nekicho-subtle text-xs text-nekicho-text">
          <span className="font-bold text-nekicho-primary">Admin Session Active</span>
          <p className="text-[11px] text-nekicho-muted">admin@nekicho.com</p>
        </div>
      </div>

      <AdminDashboardClient
        initialOrders={orders}
        initialProducts={products}
        categories={categories}
      />
    </div>
  );
}

