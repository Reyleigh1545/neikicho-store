import React from "react";
import Link from "next/link";
import NekiLogo from "@/components/ui/NekiLogo";
import { Gift, Package, Truck, RotateCcw } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Gift,
    title: "Chọn quà theo người nhận",
    text: "3 hộp làm sẵn cho mẹ, người thương, bạn bè & người thân.",
  },
  {
    icon: Package,
    title: "Thấy rõ từng món",
    text: "Mỗi món có chất liệu, kích thước, màu hoặc mùi ghi rõ.",
  },
  {
    icon: Truck,
    title: "Giao nội thành Hà Nội",
    text: "Chọn ngày nhận khi đặt. Đóng gói chống sốc.",
  },
  {
    icon: RotateCcw,
    title: "Đổi mới trong 48 giờ",
    text: "Giao sai món, hỏng khi vận chuyển hoặc khác ảnh.",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-nekicho-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          {VALUE_PROPS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-3 p-4 rounded-2xl bg-nekicho-bg border border-nekicho-subtle"
            >
              <div className="w-10 h-10 rounded-full bg-nekicho-subtle text-nekicho-primary flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-nekicho-text">{title}</h4>
                <p className="text-xs text-nekicho-muted mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-nekicho-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <NekiLogo className="h-10 w-auto" />
              <p className="text-xs text-nekicho-muted leading-relaxed">
                NekiCho làm hộp quà theo dịp lễ cho sinh viên và người mới đi làm ở Hà Nội: mỗi hộp chỉ 1–2 món dùng
                được, kèm thiệp in lời nhắn của bạn.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-nekicho-text uppercase tracking-wider mb-3">Mua sắm</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/shop?category=gift-sets" className="text-nekicho-muted hover:text-nekicho-primary transition font-semibold">
                    3 hộp quà theo người nhận
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-nekicho-muted hover:text-nekicho-primary transition">
                    Tất cả sản phẩm
                  </Link>
                </li>
                <li>
                  <Link href="/custom-box" className="text-nekicho-muted hover:text-nekicho-primary transition">
                    Tự ghép hộp quà
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="text-nekicho-muted hover:text-nekicho-primary transition">
                    Tra cứu đơn thử
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-nekicho-text uppercase tracking-wider mb-3">Chính sách</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/policies/delivery" className="text-nekicho-muted hover:text-nekicho-primary transition">
                    Giao hàng
                  </Link>
                </li>
                <li>
                  <Link href="/policies/returns" className="text-nekicho-muted hover:text-nekicho-primary transition">
                    Đổi trả
                  </Link>
                </li>
                <li>
                  <Link href="/policies/privacy" className="text-nekicho-muted hover:text-nekicho-primary transition">
                    Quyền riêng tư
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-nekicho-muted hover:text-nekicho-primary transition">
                    Về NekiCho
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Required by the project rules */}
          <div className="border-t border-nekicho-subtle mt-10 pt-6 text-center text-xs text-nekicho-text space-y-1">
            <p className="font-bold">Student project – E-Business, Hanoi University</p>
            <p className="text-nekicho-muted">
              NekiCho là sản phẩm concept, không bán thật. Checkout chỉ chạy test mode: không thu tiền, không giao hàng.
              Ảnh sản phẩm là ảnh minh họa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
