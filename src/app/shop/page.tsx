import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import { Filter, SlidersHorizontal, Search, Gift } from "lucide-react";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    boxOnly?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search, sort, boxOnly } = searchParams;

  // Build Prisma where query
  const where: any = { isActive: true };

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (boxOnly === "true") {
    where.boxCompatible = true;
  }

  // Sorting
  let orderBy: any = { isFeatured: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "name-asc") orderBy = { name: "asc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-nekicho-primary">
            NekiCho
          </span>
          <h1 className="text-3xl font-extrabold text-nekicho-text mt-1">
            Hộp quà và món lẻ
          </h1>
          <p className="text-xs sm:text-sm text-nekicho-muted mt-1">
            Chọn 1 trong 3 hộp làm sẵn, hoặc mua từng món để tự ghép hộp.
          </p>
        </div>

        <Link
          href="/custom-box"
          className="px-5 py-3 rounded-full bg-nekicho-subtle hover:bg-nekicho-light/30 text-nekicho-primary font-bold text-xs flex items-center space-x-2 transition self-start md:self-auto border border-nekicho-border"
        >
          <Gift className="w-4 h-4" />
          <span>Tự ghép hộp</span>
        </Link>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0 space-y-6">
          {/* Category Filter */}
          <div className="bg-white rounded-3xl p-5 border border-nekicho-border shadow-soft space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-nekicho-text flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-nekicho-primary" />
              <span>Danh mục</span>
            </h3>

            <div className="space-y-1">
              <Link
                href="/shop"
                className={`block px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  !category
                    ? "bg-nekicho-subtle text-nekicho-primary font-bold"
                    : "text-nekicho-muted hover:bg-nekicho-bg hover:text-nekicho-text"
                }`}
              >
                Tất cả
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    category === cat.slug
                      ? "bg-nekicho-subtle text-nekicho-primary font-bold"
                      : "text-nekicho-muted hover:bg-nekicho-bg hover:text-nekicho-text"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-nekicho-muted bg-nekicho-bg px-2 py-0.5 rounded-full">
                    {cat._count.products}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Box Friendly Toggle */}
          <div className="bg-white rounded-3xl p-5 border border-nekicho-border shadow-soft">
            <h3 className="font-bold text-xs uppercase tracking-wider text-nekicho-text mb-3">
              Hộp tự ghép
            </h3>
            <Link
              href={
                boxOnly === "true"
                  ? `/shop${category ? `?category=${category}` : ""}`
                  : `/shop?${category ? `category=${category}&` : ""}boxOnly=true`
              }
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                boxOnly === "true"
                  ? "bg-nekicho-primary text-white border-nekicho-primary"
                  : "bg-nekicho-cream text-nekicho-text border-nekicho-border hover:bg-nekicho-subtle"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Chỉ món cho vào hộp được</span>
            </Link>
          </div>
        </div>

        {/* Products Grid & Sort */}
        <div className="flex-1 space-y-6">
          {/* Top Bar Sort and Results */}
          <div className="bg-white rounded-2xl px-5 py-3 border border-nekicho-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-nekicho-muted font-medium">
              <strong className="text-nekicho-text">{products.length}</strong> sản phẩm
              {category && <span> in <strong className="text-nekicho-primary">{category}</strong></span>}
            </span>

            {/* Sort Dropdown Links */}
            <div className="flex items-center space-x-2">
              <span className="text-nekicho-muted">Sắp xếp:</span>
              <div className="flex items-center space-x-1">
                <Link
                  href={`/shop?${category ? `category=${category}&` : ""}${boxOnly ? "boxOnly=true&" : ""}sort=featured`}
                  className={`px-2.5 py-1 rounded-lg ${
                    !sort || sort === "featured"
                      ? "bg-nekicho-subtle text-nekicho-primary font-bold"
                      : "text-nekicho-muted hover:text-nekicho-text"
                  }`}
                >
                  Nổi bật
                </Link>
                <Link
                  href={`/shop?${category ? `category=${category}&` : ""}${boxOnly ? "boxOnly=true&" : ""}sort=price-asc`}
                  className={`px-2.5 py-1 rounded-lg ${
                    sort === "price-asc"
                      ? "bg-nekicho-subtle text-nekicho-primary font-bold"
                      : "text-nekicho-muted hover:text-nekicho-text"
                  }`}
                >
                  Giá tăng dần
                </Link>
                <Link
                  href={`/shop?${category ? `category=${category}&` : ""}${boxOnly ? "boxOnly=true&" : ""}sort=price-desc`}
                  className={`px-2.5 py-1 rounded-lg ${
                    sort === "price-desc"
                      ? "bg-nekicho-subtle text-nekicho-primary font-bold"
                      : "text-nekicho-muted hover:text-nekicho-text"
                  }`}
                >
                  Giá giảm dần
                </Link>
              </div>
            </div>
          </div>

          {/* Products List */}
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-nekicho-border shadow-soft space-y-3">
              <div className="w-16 h-16 rounded-full bg-nekicho-subtle text-nekicho-primary flex items-center justify-center mx-auto">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-nekicho-text text-lg">Không có sản phẩm phù hợp</h3>
              <p className="text-xs text-nekicho-muted max-w-sm mx-auto">
                Hãy xoá bộ lọc để xem tất cả sản phẩm.
              </p>
              <Link
                href="/shop"
                className="inline-block px-5 py-2.5 bg-nekicho-primary text-white rounded-full text-xs font-bold hover:bg-nekicho-dark transition shadow-soft"
              >
                Xoá bộ lọc
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  description={product.description}
                  price={product.price}
                  imageKey={product.imageKey}
                  category={product.category}
                  isFeatured={product.isFeatured}
                  boxCompatible={product.boxCompatible}
                  stock={product.stock}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

