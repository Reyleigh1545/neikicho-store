import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import { Gift, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "3 hộp quà theo người nhận | NekiCho" };

/**
 * Dedicated page for the 3 ready-made gift sets.
 * Round 2: T11 clicked "3 hộp quà" and landed on what looked like "All products".
 */
export default async function GiftSetsPage() {
  const giftSets = await prisma.product.findMany({
    where: { isActive: true, category: { slug: "gift-sets" } },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-nekicho-primary">Hộp làm sẵn</span>
        <h1 className="text-3xl font-extrabold text-nekicho-text">3 hộp quà theo người nhận</h1>
        <p className="text-sm text-nekicho-muted">
          Chọn hộp theo người bạn muốn tặng. Giá đã gồm hộp NekiCho, giấy lót chống sốc và thiệp in lời nhắn của bạn.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-nekicho-border p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
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

      <div className="text-center text-sm text-nekicho-muted space-x-1">
        <span>Muốn tự chọn từng món?</span>
        <Link href="/custom-box" className="inline-flex items-center font-bold text-nekicho-primary underline">
          <Gift className="w-4 h-4 mr-1" />
          Tự ghép hộp
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
