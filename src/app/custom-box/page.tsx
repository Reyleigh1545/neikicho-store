import React from "react";
import { prisma } from "@/lib/prisma";
import CustomBoxStudio from "@/components/gift-box/CustomBoxStudio";
import { Sparkles, Gift } from "lucide-react";

export const dynamic = "force-dynamic";

interface CustomBoxPageProps {
  searchParams: {
    preselect?: string;
  };
}

export default async function CustomBoxPage({ searchParams }: CustomBoxPageProps) {
  const [boxes, ribbons, cards, availableProducts] = await Promise.all([
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
      include: { category: true },
      orderBy: { price: "asc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-nekicho-subtle text-nekicho-primary text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tự chọn từng món</span>
          </div>
          <h1 className="text-3xl font-extrabold text-nekicho-text">
            Tự ghép hộp quà
          </h1>
          <p className="text-xs sm:text-sm text-nekicho-muted mt-1 max-w-2xl">
            Chọn cỡ hộp, bỏ các món lẻ (ly, bình, nến, hoa sáp, khăn, tất) vào, chọn ruy băng và viết lời nhắn. Giá = giá hộp + giá từng món. Nếu muốn nhanh hơn, hãy chọn 1 trong 3 hộp làm sẵn.
          </p>
        </div>

        <div className="bg-nekicho-bg px-4 py-3 rounded-2xl border border-nekicho-subtle text-xs text-nekicho-dark font-medium self-start md:self-auto flex items-center space-x-2">
          <Gift className="w-4 h-4 text-nekicho-primary" />
          <span>Có giấy lót chống sốc và thiệp in lời nhắn</span>
        </div>
      </div>

      {/* Interactive Studio */}
      <CustomBoxStudio
        boxOptions={boxes}
        ribbonOptions={ribbons}
        cardOptions={cards}
        availableProducts={availableProducts}
        preselectedProductId={searchParams.preselect}
      />
    </div>
  );
}

