import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          category: true,
          variants: { where: { isActive: true } },
        },
      },
    },
  });
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  featuredOnly?: boolean;
  boxOnly?: boolean;
  search?: string;
  limit?: number;
}) {
  const where: any = { isActive: true };

  if (options?.categoryId) {
    where.categoryId = options.categoryId;
  }

  if (options?.categorySlug) {
    where.category = { slug: options.categorySlug };
  }

  if (options?.featuredOnly) {
    where.isFeatured = true;
  }

  if (options?.boxOnly) {
    where.boxCompatible = true;
  }

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search } },
      { description: { contains: options.search } },
    ];
  }

  return prisma.product.findMany({
    where,
    orderBy: { isFeatured: "desc" },
    include: {
      category: true,
      variants: { where: { isActive: true } },
    },
    take: options?.limit,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { where: { isActive: true } },
    },
  });
}

export async function getGiftBoxOptions() {
  const [boxes, ribbons, cards] = await Promise.all([
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
  ]);

  return { boxes, ribbons, cards };
}

export async function getBoxCompatibleProducts() {
  return prisma.product.findMany({
    where: {
      boxCompatible: true,
      isActive: true,
      stock: { gt: 0 },
    },
    include: {
      category: true,
      variants: { where: { isActive: true, stock: { gt: 0 } } },
    },
    orderBy: { price: "asc" },
  });
}

export async function getOrders(userId?: string) {
  const where = userId ? { userId } : {};
  return prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          giftBox: {
            include: {
              items: true,
            },
          },
        },
      },
    },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
          giftBox: {
            include: {
              items: {
                include: {
                  product: true,
                  variant: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
