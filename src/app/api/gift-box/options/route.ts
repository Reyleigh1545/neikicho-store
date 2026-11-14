import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const [boxes, ribbons, cards, boxCompatibleProducts] = await Promise.all([
      prisma.giftBoxOption.findMany({
        where: { type: "BOX", isActive: true },
        orderBy: { price: "asc" },
      }),
      prisma.giftBoxOption.findMany({
        where: { type: "RIBBON", isActive: true },
        orderBy: { price: "asc" },
      }),
      prisma.giftBoxOption.findMany({
        where: { type: "CARD", isActive: true },
        orderBy: { price: "asc" },
      }),
      prisma.product.findMany({
        where: { boxCompatible: true, isActive: true, stock: { gt: 0 } },
        include: {
          category: true,
          variants: { where: { isActive: true, stock: { gt: 0 } } },
        },
        orderBy: { price: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      options: {
        boxes,
        ribbons,
        cards,
      },
      availableProducts: boxCompatibleProducts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi khi tải tùy chọn hộp quà." },
      { status: 500 }
    );
  }
}

