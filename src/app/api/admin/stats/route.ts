import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authCheck = await requireAdmin(req);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    const [orders, products, categories] = await Promise.all([
      prisma.order.findMany({
        select: {
          id: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          category: { select: { name: true } },
        },
      }),
      prisma.category.count({ where: { isActive: true } }),
    ]);

    const totalRevenueVND = orders.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrdersCount = orders.length;

    const ordersByStatus = {
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
      SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
      DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
    };

    const lowStockProducts = products.filter((p) => p.stock <= 5);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenueVND,
        totalOrdersCount,
        ordersByStatus,
        totalProductsCount: products.length,
        totalCategoriesCount: categories,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi khi lấy thống kê quản trị." },
      { status: 500 }
    );
  }
}

