"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatVND } from "@/config/shop";
import { Plus, Minus, ShoppingBag, Gift, Check } from "lucide-react";

interface VariantOption {
  id: string;
  name: string;
  price: number | null;
  stock: number;
}

interface ProductDetailActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageKey?: string | null;
    stock: number;
    boxCompatible: boolean;
    variants: VariantOption[];
  };
}

export default function ProductDetailActions({
  product,
}: ProductDetailActionsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const hasVariants = product.variants.length > 0;
  const [variantId, setVariantId] = useState<string>(
    hasVariants ? product.variants[0].id : ""
  );

  const selectedVariant = product.variants.find((v) => v.id === variantId);
  const unitPrice = selectedVariant?.price ?? product.price;
  const maxQty = Math.max(1, selectedVariant?.stock ?? product.stock);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      name: selectedVariant
        ? `${product.name} – ${selectedVariant.name}`
        : product.name,
      price: unitPrice,
      quantity,
      imageKey: product.imageKey || undefined,
      isCustomBox: false,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-nekicho-subtle">
      {/* Variant selector */}
      {hasVariants && (
        <div className="space-y-2">
          <label
            htmlFor="variant"
            className="text-xs font-bold text-nekicho-muted uppercase tracking-wider"
          >
            Chọn món / màu / mùi
          </label>
          <div className="grid grid-cols-1 gap-2">
            {product.variants.map((v) => {
              const price = v.price ?? product.price;
              const active = v.id === variantId;
              return (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  disabled={v.stock <= 0}
                  className={`flex items-center justify-between text-left px-4 py-3 rounded-2xl border-2 text-sm transition ${
                    active
                      ? "border-nekicho-primary bg-nekicho-bg font-bold"
                      : "border-nekicho-border bg-white hover:border-nekicho-light"
                  } ${v.stock <= 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <span className="text-nekicho-text">{v.name}</span>
                  <span className="text-nekicho-primary font-bold ml-3 whitespace-nowrap">
                    {formatVND(price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector and Total */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 bg-nekicho-bg rounded-2xl border border-nekicho-border px-3.5 py-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-nekicho-muted hover:text-nekicho-primary p-1"
            aria-label="Giảm số lượng"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm text-nekicho-text min-w-[1.5rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            className="text-nekicho-muted hover:text-nekicho-primary p-1"
            aria-label="Tăng số lượng"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-nekicho-muted">
          Tạm tính:{" "}
          <strong className="text-sm text-nekicho-text font-bold">
            {formatVND(unitPrice * quantity)}
          </strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`flex-1 py-4 px-6 rounded-full font-bold text-sm shadow-soft hover:shadow-elevated transition-all flex items-center justify-center space-x-2 ${
            added
              ? "bg-green-600 text-white"
              : "bg-nekicho-primary hover:bg-nekicho-dark text-white"
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              <span>Đã thêm vào giỏ!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Thêm vào giỏ • {formatVND(unitPrice * quantity)}</span>
            </>
          )}
        </button>

        {product.boxCompatible && (
          <Link
            href={`/custom-box?preselect=${product.id}`}
            className="py-4 px-6 rounded-full font-bold text-sm bg-nekicho-subtle hover:bg-nekicho-light/40 text-nekicho-primary border border-nekicho-border transition flex items-center justify-center space-x-2 text-center"
          >
            <Gift className="w-4 h-4" />
            <span>Cho vào hộp tự chọn</span>
          </Link>
        )}
      </div>
      <p className="text-[11px] text-nekicho-muted">
        Lời nhắn in lên thiệp và ngày muốn nhận hàng được nhập ở bước thanh toán.
      </p>
    </div>
  );
}
