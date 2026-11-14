import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authCheck = await requireAdmin(req);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      stock,
      categoryId,
      imageKey,
      isFeatured,
      boxCompatible,
      sizeUnits,
    } = body;

    if (!name || price === undefined || !categoryId) {
      return NextResponse.json(
        { error: "Name, price and category are required" },
        { status: 400 }
      );
    }

    if (Number(price) < 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    // Verify category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { error: "Category does not exist" },
        { status: 400 }
      );
    }

    const finalSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
        "-" +
        Math.floor(100 + Math.random() * 900);

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || "Artisanal handcrafted gift by NekiCho.",
        price: Number(price),
        stock: Number(stock) !== undefined ? Math.max(0, Number(stock)) : 20,
        categoryId,
        imageKey: imageKey || null,
        isFeatured: Boolean(isFeatured),
        boxCompatible: boxCompatible !== undefined ? Boolean(boxCompatible) : true,
        sizeUnits: Number(sizeUnits) || 1,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authCheck = await requireAdmin(req);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    const body = await req.json();
    const { id, stock, isActive, isFeatured, price, name, description } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const updateData: any = {};
    if (stock !== undefined) updateData.stock = Math.max(0, Number(stock));
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (price !== undefined) {
      if (Number(price) < 0) {
        return NextResponse.json(
          { error: "Price cannot be negative" },
          { status: 400 }
        );
      }
      updateData.price = Number(price);
    }
    if (name) updateData.name = name.trim();
    if (description) updateData.description = description.trim();

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authCheck = await requireAdmin(req);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
