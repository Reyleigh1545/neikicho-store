import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/config/shop";
import {
  CheckCircle,
  Clock,
  Truck,
  PackageCheck,
  Gift,
  ArrowRight,
  Printer,
  ShoppingBag,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const steps = [
    { key: "PENDING", label: "Đã nhận đơn", icon: Clock },
    { key: "PROCESSING", label: "Đang gói quà", icon: Gift },
    { key: "SHIPPED", label: "Đang giao", icon: Truck },
    { key: "DELIVERED", label: "Đã giao", icon: PackageCheck },
  ];

  const getStepStatus = (stepKey: string) => {
    const orderLevels: Record<string, number> = {
      PENDING: 1,
      PROCESSING: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: 0,
    };

    const currentLevel = orderLevels[order.status] ?? 1;
    const stepLevel = orderLevels[stepKey] ?? 1;

    if (order.status === "CANCELLED") return "cancelled";
    if (currentLevel >= stepLevel) return "completed";
    return "upcoming";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Thank you notification banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-elevated text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
          <CheckCircle className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-nekicho-primary">
          Đã tạo đơn thử (test mode)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-nekicho-text">
          Cảm ơn bạn đã thử đặt hàng!
        </h1>
        <p className="text-xs sm:text-sm text-nekicho-muted max-w-md mx-auto">
          Đơn thử <strong className="text-nekicho-primary font-bold">#{order.orderNumber}</strong> đã được ghi nhận. Đây là Student project – E-Business, Hanoi University: không thu tiền và không giao hàng thật.
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-nekicho-muted">
          Trạng thái đơn (mô phỏng)
        </h3>

        <div className="grid grid-cols-4 gap-2 text-center">
          {steps.map((s, idx) => {
            const status = getStepStatus(s.key);
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    status === "completed"
                      ? "bg-nekicho-primary text-white shadow-soft"
                      : "bg-nekicho-subtle/50 text-nekicho-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-bold ${
                    status === "completed"
                      ? "text-nekicho-primary"
                      : "text-nekicho-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details & Items Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-nekicho-subtle gap-2">
          <div>
            <h2 className="text-lg font-bold text-nekicho-text">
              Đơn #{order.orderNumber}
            </h2>
            <p className="text-xs text-nekicho-muted">
              Đặt lúc {new Date(order.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                order.paymentStatus === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              Test mode · chưa thanh toán
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-nekicho-subtle text-nekicho-primary">
              {order.paymentMethod === "BANK_TRANSFER" ? "Chuyển khoản (thử)" : "COD (thử)"}
            </span>
          </div>
        </div>

        {/* Customer & Delivery Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-nekicho-bg border border-nekicho-border text-xs">
          <div>
            <h4 className="font-bold text-nekicho-text uppercase tracking-wider text-[10px] mb-1">
              Giao đến:
            </h4>
            <p className="font-semibold text-nekicho-text">{order.customerName}</p>
            <p className="text-nekicho-muted">{order.shippingAddress}</p>
            {order.city && <p className="text-nekicho-muted">{order.city}</p>}
          </div>

          <div>
            <h4 className="font-bold text-nekicho-text uppercase tracking-wider text-[10px] mb-1">
              Ngày nhận, thiệp và ghi chú:
            </h4>
            <p className="italic text-nekicho-muted whitespace-pre-line">
              {order.notes || "Không có ghi chú."}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-nekicho-muted">
            Sản phẩm ({order.items.length})
          </h3>

          <div className="space-y-3">
            {order.items.map((item) => {
              let parsedBox: any = null;
              if (item.isCustomBox && item.boxDetails) {
                try {
                  parsedBox = JSON.parse(item.boxDetails);
                } catch (e) {
                  // ignore
                }
              }

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-nekicho-border bg-nekicho-cream/50 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {item.isCustomBox && (
                        <Gift className="w-5 h-5 text-nekicho-primary flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-nekicho-text">
                          {item.name}
                        </h4>
                        <p className="text-xs text-nekicho-muted">
                          {item.variantName ? `${item.variantName} · ` : ""}SL: {item.quantity} × {formatVND(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-nekicho-primary">
                      {formatVND(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Render Custom Box Deep Details */}
                  {parsedBox && (
                    <div className="pt-2 border-t border-nekicho-subtle space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-nekicho-muted">
                        <p>🎀 Ruy băng: <strong className="text-nekicho-text">{parsedBox.ribbonName}</strong></p>
                        <p>💌 Thiệp: <strong className="text-nekicho-text">{parsedBox.cardName}</strong></p>
                      </div>

                      {parsedBox.cardMessage && (
                        <div className="p-3 bg-white rounded-xl border border-dashed border-nekicho-border">
                          <p className="text-[10px] uppercase font-bold text-nekicho-primary">Lời nhắn trên thiệp:</p>
                          <p className="italic text-nekicho-text">&ldquo;{parsedBox.cardMessage}&rdquo;</p>
                        </div>
                      )}

                      {parsedBox.items && parsedBox.items.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-nekicho-muted mb-1">
                            Món trong hộp:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {parsedBox.items.map((gi: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-white border border-nekicho-border text-nekicho-text text-[11px] font-medium"
                              >
                                {gi.quantity}x {gi.productName || gi.name}{gi.variantName ? ` (${gi.variantName})` : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-nekicho-subtle space-y-1.5 text-xs max-w-xs ml-auto">
          <div className="flex justify-between text-nekicho-muted">
            <span>Tạm tính</span>
            <span className="font-semibold text-nekicho-text">{formatVND(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-nekicho-muted">
            <span>Phí giao hàng</span>
            <span className="font-semibold text-nekicho-text">
              {order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-nekicho-text pt-2 border-t border-nekicho-subtle">
            <span>Tổng (không thu tiền)</span>
            <span className="text-nekicho-primary">{formatVND(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Post-order Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/shop"
          className="px-6 py-3.5 bg-nekicho-primary hover:bg-nekicho-dark text-white rounded-full font-bold text-xs shadow-soft transition text-center"
        >
          Tiếp tục xem cửa hàng
        </Link>
        <Link
          href="/custom-box"
          className="px-6 py-3.5 bg-white border border-nekicho-border text-nekicho-text hover:text-nekicho-primary rounded-full font-bold text-xs shadow-soft transition text-center"
        >
          Tự ghép hộp quà
        </Link>
      </div>
    </div>
  );
}

