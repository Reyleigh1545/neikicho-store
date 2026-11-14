import React from "react";
import Link from "next/link";
import { Gift, Eye, Truck, Heart } from "lucide-react";

export const metadata = { title: "Về NekiCho" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-4 text-sm text-nekicho-text leading-relaxed">
        <h1 className="text-2xl font-extrabold">Về NekiCho</h1>
        <p>
          NekiCho làm hộp quà theo dịp lễ cho sinh viên và người mới đi làm ở Hà Nội. Khi phỏng vấn người mua, chúng
          mình nghe nhiều nhất ba điều: không biết tặng gì, sợ hàng nhận về khác ảnh, và sợ giao trễ. NekiCho được
          thiết kế để giải quyết ba điều đó.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Gift, t: "Chọn theo người nhận", d: "3 hộp làm sẵn cho mẹ, người thương, bạn bè & người thân." },
            { icon: Heart, t: "Ít món nhưng dùng được", d: "Mỗi hộp chỉ 1–2 món thực dụng, không nhồi đồ trang trí." },
            { icon: Eye, t: "Thấy rõ từng món", d: "Ghi chất liệu, kích thước, màu và mùi của mỗi món." },
            { icon: Truck, t: "Giao đúng ngày", d: "Chọn ngày nhận khi đặt, hộp cứng lót chống sốc." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="p-4 rounded-2xl bg-nekicho-bg border border-nekicho-subtle flex items-start space-x-3">
              <Icon className="w-5 h-5 text-nekicho-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{t}</p>
                <p className="text-xs text-nekicho-muted">{d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900">
          <p className="font-bold">Student project – E-Business, Hanoi University</p>
          <p className="mt-1">
            NekiCho là dự án của một nhóm 4 sinh viên. Sản phẩm là concept, chưa bán thật. Checkout chỉ chạy test mode:
            không thu tiền, không giao hàng. Ảnh sản phẩm là ảnh minh họa.
          </p>
        </div>

        <Link
          href="/shop?category=gift-sets"
          className="inline-block px-6 py-3 bg-nekicho-primary text-white rounded-full text-xs font-bold shadow-soft hover:bg-nekicho-dark transition"
        >
          Xem 3 hộp quà
        </Link>
      </div>
    </div>
  );
}
