import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import NekiImage from "@/components/ui/NekiImage";
import { CATEGORY_IMAGES } from "@/config/images";
import { Gift, ArrowRight, Truck, Package, PenLine } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [giftSets, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, category: { slug: "gift-sets" } },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true, slug: { not: "gift-sets" } },
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-14 md:py-16 bg-gradient-to-b from-white to-nekicho-bg border-b border-nekicho-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-nekicho-subtle text-nekicho-primary text-xs font-bold tracking-wide">
                <Gift className="w-3.5 h-3.5" />
                <span>Hộp quà Giáng sinh &amp; Tết · Hà Nội</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-nekicho-text tracking-tight leading-[1.15]">
                Chọn quà theo <span className="brand-gradient-text">người nhận</span>
              </h1>

              <p className="text-base sm:text-lg text-nekicho-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                3 hộp làm sẵn cho mẹ, người thương, bạn bè &amp; người thân. Mỗi hộp làm sẵn có 1–2 món dùng được thật, ghi rõ
                chất liệu và kích thước, kèm thiệp in lời nhắn của bạn.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="#hop-qua"
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-nekicho-primary hover:bg-nekicho-dark text-white font-bold text-sm shadow-soft transition flex items-center justify-center space-x-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Xem 3 hộp quà</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/custom-box"
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-nekicho-subtle/50 text-nekicho-text font-bold text-sm border border-nekicho-border shadow-soft transition flex items-center justify-center"
                >
                  Tự ghép hộp
                </Link>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-nekicho-text">
                <div className="flex items-center justify-center lg:justify-start space-x-1.5">
                  <Truck className="w-4 h-4 text-nekicho-primary" />
                  <span>Giao nội thành HN, chọn ngày nhận</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-1.5">
                  <Package className="w-4 h-4 text-nekicho-primary" />
                  <span>Hộp cứng, lót chống sốc</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-1.5">
                  <PenLine className="w-4 h-4 text-nekicho-primary" />
                  <span>Thiệp in lời nhắn của bạn</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden border border-nekicho-border shadow-elevated bg-white">
                <NekiImage
                  src="/images/products/box-open-full.jpg"
                  alt="Hộp quà NekiCho mở nắp với các món bên trong (ảnh minh họa)"
                  fill
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-nekicho-muted text-center mt-2">
                Ảnh minh họa của concept. Hộp làm sẵn có 1–2 món; hộp tự ghép có 2–5 món tùy cỡ hộp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 ready-made gift sets */}
      <section id="hop-qua" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-nekicho-primary">Hộp làm sẵn</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-nekicho-text mt-1">3 hộp quà theo người nhận</h2>
        </div>

        <div className="mb-6 rounded-2xl bg-white border border-nekicho-border p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="font-extrabold text-nekicho-primary">159.000 ₫</p>
            <p className="text-nekicho-muted text-xs">1 món nhỏ: nến thơm hoặc hoa sáp</p>
          </div>
          <div>
            <p className="font-extrabold text-nekicho-primary">249.000 ₫</p>
            <p className="text-nekicho-muted text-xs">1 món dùng hằng ngày: ly, bình giữ nhiệt hoặc khăn len</p>
          </div>
          <div>
            <p className="font-extrabold text-nekicho-primary">349.000 ₫</p>
            <p className="text-nekicho-muted text-xs">Combo 2 món: 1 món nhỏ + 1 món dùng hằng ngày</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {giftSets.map((product) => (
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
      </section>

      {/* Single items by category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-nekicho-primary">Món lẻ</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-nekicho-text mt-1">Xem từng món</h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-nekicho-primary hover:text-nekicho-dark flex items-center space-x-1 mt-2 md:mt-0"
          >
            <span>Tất cả sản phẩm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const img = CATEGORY_IMAGES[category.slug];
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group rounded-3xl bg-white border border-nekicho-border hover:border-nekicho-light shadow-soft hover:shadow-elevated transition overflow-hidden"
              >
                <div className="relative aspect-square bg-nekicho-bg">
                  {img && (
                    <NekiImage
                      src={img.src}
                      alt={img.alt}
                      category={category.name}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-bold text-sm text-nekicho-text group-hover:text-nekicho-primary transition">
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Custom box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-nekicho-subtle via-nekicho-cream to-nekicho-bg border border-nekicho-border p-8 md:p-10 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-nekicho-text">Muốn tự chọn từng món?</h2>
          <p className="text-sm text-nekicho-muted max-w-2xl mx-auto">
            Chọn cỡ hộp (tiêu chuẩn 2–3 món, cỡ lớn 2–5 món), bỏ các món lẻ vào, chọn ruy băng và viết lời nhắn. Giá = giá hộp + giá từng món.
          </p>
          <Link
            href="/custom-box"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-nekicho-primary hover:bg-nekicho-dark text-white font-bold text-sm shadow-soft transition"
          >
            <span>Tự ghép hộp quà</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
