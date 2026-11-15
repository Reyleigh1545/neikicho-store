"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Gift,
  ShieldCheck,
  Banknote,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import NekiImage from "@/components/ui/NekiImage";
import { getProductAsset } from "@/config/images";
import { formatVND, SHOP_CONFIG } from "@/config/shop";

const CARD_MESSAGE_MAX = 150;

// Inner-city Hanoi districts (the shop only delivers inside the inner city)
const HANOI_DISTRICTS = [
  "Ba Đình",
  "Hoàn Kiếm",
  "Đống Đa",
  "Hai Bà Trưng",
  "Cầu Giấy",
  "Thanh Xuân",
  "Tây Hồ",
  "Hoàng Mai",
  "Long Biên",
  "Nam Từ Liêm",
  "Bắc Từ Liêm",
  "Hà Đông",
];

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    shippingAddress: "",
    district: HANOI_DISTRICTS[0],
    deliveryDate: todayISO(1),
    cardMessage: "",
    deliveryNote: "",
    paymentMethod: "COD",
    acknowledged: false,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || prev.customerName,
        shippingAddress: user.address || prev.shippingAddress,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Giỏ hàng đang trống.");
      return;
    }
    if (!formData.customerName.trim() || !formData.shippingAddress.trim()) {
      setError("Vui lòng nhập tên người nhận và địa chỉ (dùng thông tin giả).");
      return;
    }
    if (!formData.acknowledged) {
      setError("Vui lòng đánh dấu ô xác nhận đây là đơn thử.");
      return;
    }

    // Delivery date, card message and delivery note are saved in the order notes
    const notes = [
      `Ngày muốn nhận: ${formData.deliveryDate}`,
      formData.cardMessage.trim()
        ? `Lời nhắn in lên thiệp: "${formData.cardMessage.trim()}"`
        : "Lời nhắn in lên thiệp: (không có)",
      formData.deliveryNote.trim() ? `Ghi chú giao hàng: ${formData.deliveryNote.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          shippingAddress: formData.shippingAddress,
          city: `Quận ${formData.district}, Hà Nội`,
          notes,
          paymentMethod: formData.paymentMethod,
          userId: user?.id || null,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không tạo được đơn thử.");
      }

      clearCart();
      router.push(`/orders/${data.order.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo đơn thử.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-nekicho-subtle text-nekicho-primary flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-nekicho-text">Giỏ hàng đang trống</h1>
        <p className="text-sm text-nekicho-muted">
          Hãy chọn một hộp quà hoặc tự ghép hộp trước khi thanh toán.
        </p>
        <div className="pt-2">
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

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-nekicho-border text-sm focus:border-nekicho-primary focus:ring-1 focus:ring-nekicho-primary outline-none bg-white";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-1.5 text-xs text-nekicho-muted hover:text-nekicho-primary mb-3 font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tiếp tục mua sắm</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-nekicho-text">Thanh toán</h1>
      </div>

      {/* Test-mode notice: project rules (no real payment, no real personal data) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Đây là checkout thử nghiệm (test mode).</p>
          <p className="mt-1">
            NekiCho là Student project – E-Business, Hanoi University. Sản phẩm là concept, không bán thật:
            không thu tiền, không giao hàng. Hãy dùng <strong>tên và địa chỉ giả</strong>; trang này không hỏi
            số điện thoại hay email.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Recipient & address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-4">
              <h2 className="text-base font-bold text-nekicho-text flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-nekicho-subtle text-nekicho-primary flex items-center justify-center text-xs">
                  1
                </span>
                <span>Người nhận và địa chỉ</span>
              </h2>

              <div>
                <label htmlFor="customerName" className="block text-xs font-bold text-nekicho-text mb-1">
                  Tên người nhận (dùng tên giả) *
                </label>
                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="VD: Nguyễn Văn A"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="shippingAddress" className="block text-xs font-bold text-nekicho-text mb-1">
                  Địa chỉ nhận hàng (dùng địa chỉ giả) *
                </label>
                <input
                  id="shippingAddress"
                  type="text"
                  name="shippingAddress"
                  required
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  placeholder="VD: Số 1 phố Thử Nghiệm"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="district" className="block text-xs font-bold text-nekicho-text mb-1">
                    Quận (chỉ giao nội thành Hà Nội)
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {HANOI_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="deliveryDate" className="block text-xs font-bold text-nekicho-text mb-1">
                    Ngày muốn nhận *
                  </label>
                  <input
                    id="deliveryDate"
                    type="date"
                    name="deliveryDate"
                    required
                    min={todayISO(0)}
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deliveryNote" className="block text-xs font-bold text-nekicho-text mb-1">
                  Ghi chú giao hàng (không bắt buộc)
                </label>
                <input
                  id="deliveryNote"
                  type="text"
                  name="deliveryNote"
                  value={formData.deliveryNote}
                  onChange={handleChange}
                  placeholder="VD: giao giờ hành chính"
                  className={inputClass}
                />
              </div>
            </div>

            {/* 2. Card message */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-3">
              <h2 className="text-base font-bold text-nekicho-text flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-nekicho-subtle text-nekicho-primary flex items-center justify-center text-xs">
                  2
                </span>
                <span>Lời nhắn in lên thiệp <span className="font-normal text-nekicho-muted">(không bắt buộc)</span></span>
              </h2>
              <textarea
                id="cardMessage"
                name="cardMessage"
                rows={3}
                maxLength={CARD_MESSAGE_MAX}
                value={formData.cardMessage}
                onChange={handleChange}
                placeholder="VD: Chúc mẹ Giáng sinh ấm áp!"
                className={inputClass}
              />
              <p className="text-xs text-nekicho-muted flex justify-between">
                <span>Thiệp in sẵn, đặt trong hộp. Trong hộp không ghi giá tiền.</span>
                <span>
                  {formData.cardMessage.length} / {CARD_MESSAGE_MAX}
                </span>
              </p>
            </div>

            {/* 3. Payment (test mode) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-4">
              <h2 className="text-base font-bold text-nekicho-text flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-nekicho-subtle text-nekicho-primary flex items-center justify-center text-xs">
                  3
                </span>
                <span>Phương thức thanh toán (test mode)</span>
              </h2>

              {[
                {
                  value: "COD",
                  icon: <Banknote className="w-4 h-4 text-nekicho-primary" />,
                  title: "Trả tiền khi nhận hàng (COD) – thử",
                  desc: "Mô phỏng: không có shipper và không thu tiền.",
                },
                {
                  value: "BANK_TRANSFER",
                  icon: <CreditCard className="w-4 h-4 text-nekicho-primary" />,
                  title: "Chuyển khoản – thử",
                  desc: "Mô phỏng: không hiện số tài khoản, không chuyển tiền thật.",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`p-4 rounded-2xl border-2 flex items-start space-x-3 cursor-pointer transition ${
                    formData.paymentMethod === opt.value
                      ? "border-nekicho-primary bg-nekicho-bg"
                      : "border-nekicho-border hover:border-nekicho-light bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={formData.paymentMethod === opt.value}
                    onChange={handleChange}
                    className="mt-1 accent-nekicho-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {opt.icon}
                      <span className="font-bold text-sm text-nekicho-text">{opt.title}</span>
                    </div>
                    <p className="text-xs text-nekicho-muted mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}

              <label className="flex items-start space-x-2 text-sm text-nekicho-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acknowledged}
                  onChange={(e) => setFormData({ ...formData, acknowledged: e.target.checked })}
                  className="mt-1 accent-nekicho-primary"
                />
                <span>Tôi hiểu đây là đơn thử của một dự án sinh viên, không thanh toán và không giao hàng thật.</span>
              </label>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-elevated space-y-6 lg:sticky lg:top-28">
            <h2 className="text-base font-extrabold text-nekicho-text pb-3 border-b border-nekicho-subtle">
              Đơn hàng của bạn
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-nekicho-bg border border-nekicho-border text-xs flex gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-nekicho-subtle flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.isCustomBox ? (
                      <Gift className="w-6 h-6 text-nekicho-primary" />
                    ) : (
                      <NekiImage
                        src={getProductAsset(item.imageKey, item.name).src}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-bold text-nekicho-text">{item.name}</span>
                      <span className="font-bold text-nekicho-primary ml-2 whitespace-nowrap">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                    <p className="text-xs text-nekicho-muted">
                      SL: {item.quantity} × {formatVND(item.price)}
                    </p>

                    {item.isCustomBox && item.boxDetails && (
                      <div className="mt-1 text-xs text-nekicho-muted space-y-0.5">
                        <p>Ruy băng: {item.boxDetails.ribbonName || "không"}</p>
                        <p>Thiệp: {item.boxDetails.cardName || "không"}</p>
                        <p className="text-nekicho-primary font-medium">
                          {item.boxDetails.items.length} món trong hộp
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-nekicho-subtle space-y-2 text-sm">
              <div className="flex justify-between text-nekicho-muted">
                <span>Tạm tính</span>
                <span className="font-semibold text-nekicho-text">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-nekicho-muted">
                <span>Phí giao hàng (nội thành Hà Nội)</span>
                <span className="font-semibold text-nekicho-text">
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-bold">Miễn phí</span>
                  ) : (
                    formatVND(shippingFee)
                  )}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-nekicho-muted">
                  Miễn phí giao hàng cho đơn từ {formatVND(SHOP_CONFIG.freeShippingThreshold)}.
                </p>
              )}
              <div className="flex justify-between text-base font-extrabold text-nekicho-text pt-2 border-t border-nekicho-subtle">
                <span>Tổng cộng</span>
                <span className="text-nekicho-primary">{formatVND(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-full font-extrabold text-sm text-white shadow-soft hover:shadow-elevated transition flex items-center justify-center space-x-2 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-nekicho-primary hover:bg-nekicho-dark"
              }`}
            >
              {loading ? (
                <span>Đang tạo đơn thử...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Đặt đơn thử • {formatVND(grandTotal)}</span>
                </>
              )}
            </button>

            <p className="text-xs text-nekicho-muted flex items-center justify-center space-x-1 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-nekicho-primary" />
              <span>Test mode · Không thu tiền · Xem <Link href="/policies/privacy" className="underline">quyền riêng tư</Link></span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
