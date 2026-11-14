import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const boxOnly = searchParams.get("boxOnly") === "true";
    const featuredOnly = searchParams.get("featured") === "true";

    const where: any = { isActive: true };

    if (categorySlug) {
      where.category = { slug: categorySlug, isActive: true };
    }

    if (boxOnly) {
      where.boxCompatible = true;
    }

    if (featuredOnly) {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let orderBy: any = { isFeatured: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "name-asc") orderBy = { name: "asc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi khi tải danh sách sản phẩm." },
      { status: 500 }
    );
  }
}

