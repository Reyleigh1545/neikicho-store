"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Gift,
  Check,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Sparkles,
  Heart,
  Plus,
  Minus,
  Trash2,
  Mail,
  AlertCircle,
} from "lucide-react";
import NekiImage from "@/components/ui/NekiImage";
import { formatVND } from "@/config/shop";
import { getProductAsset, GIFT_BOX_ASSETS } from "@/config/images";
import { useCart } from "@/context/CartContext";

export interface BoxOptionData {
  id: string;
  type: string;
  name: string;
  slug: string;
  price: number;
  imageKey?: string | null;
  colorHex?: string | null;
  maxCapacity: number;
}

export interface BoxProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageKey?: string | null;
  sizeUnits: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface CustomBoxStudioProps {
  boxOptions: BoxOptionData[];
  ribbonOptions: BoxOptionData[];
  cardOptions: BoxOptionData[];
  availableProducts: BoxProductData[];
  preselectedProductId?: string;
}

export default function CustomBoxStudio({
  boxOptions,
  ribbonOptions,
  cardOptions,
  availableProducts,
  preselectedProductId,
}: CustomBoxStudioProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  // Wizard Step (1: Box, 2: Items, 3: Ribbon, 4: Card & Message, 5: Review)
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [selectedBox, setSelectedBox] = useState<BoxOptionData>(
    boxOptions[0] || null
  );
  const [selectedRibbon, setSelectedRibbon] = useState<BoxOptionData>(
    ribbonOptions[0] || null
  );
  const [selectedCard, setSelectedCard] = useState<BoxOptionData>(
    cardOptions[0] || null
  );
  const [cardMessage, setCardMessage] = useState(
    ""
  );

  // Selected items inside the box
  const [boxItems, setBoxItems] = useState<
    Array<{ product: BoxProductData; quantity: number }>
  >(() => {
    if (preselectedProductId) {
      const match = availableProducts.find((p) => p.id === preselectedProductId);
      if (match) {
        return [{ product: match, quantity: 1 }];
      }
    }
    return [];
  });

  // Category filter for item selection
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");

  // Calculations
  const currentCapacityUsed = boxItems.reduce(
    (acc, curr) => acc + curr.product.sizeUnits * curr.quantity,
    0
  );
  const maxCapacity = selectedBox ? selectedBox.maxCapacity : 4;
  // A custom box needs at least 2 items; a 1-item gift is the ready-made set (round 1: T5)
  const MIN_BOX_ITEMS = 2;
  const totalItemCount = boxItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const notEnoughItems = totalItemCount < MIN_BOX_ITEMS;
  const isOverCapacity = currentCapacityUsed > maxCapacity;

  const boxBasePrice = selectedBox ? selectedBox.price : 0;
  const ribbonPrice = selectedRibbon ? selectedRibbon.price : 0;
  const cardPrice = selectedCard ? selectedCard.price : 0;
  const itemsTotalPrice = boxItems.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );
  const totalCustomBoxPrice =
    boxBasePrice + ribbonPrice + cardPrice + itemsTotalPrice;

  // Handlers for Items
  const handleAddItem = (product: BoxProductData) => {
    if (currentCapacityUsed + product.sizeUnits > maxCapacity) {
      return; // Box full
    }

    setBoxItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setBoxItems((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // Add Complete Box to Cart
  const handleAddBoxToCart = () => {
    if (notEnoughItems) {
      alert("Hộp tự ghép cần ít nhất 2 món. Muốn tặng 1 món, hãy chọn hộp làm sẵn (từ 159.000 ₫).");
      setCurrentStep(2);
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F39ABD", "#E33D7D", "#A51F5E", "#FFF3F7"],
      });
    } catch (e) {
      // safe fallback
    }

    addToCart({
      name: `Hộp tự ghép: ${selectedBox.name}`,
      price: totalCustomBoxPrice,
      quantity: 1,
      isCustomBox: true,
      boxDetails: {
        boxId: selectedBox.id,
        boxName: selectedBox.name,
        boxImageKey: selectedBox.imageKey || undefined,
        boxColor: selectedBox.colorHex || undefined,
        ribbonId: selectedRibbon?.id,
        ribbonName: selectedRibbon?.name,
        cardId: selectedCard?.id,
        cardName: selectedCard?.name,
        cardMessage,
        items: boxItems.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          imageKey: i.product.imageKey || undefined,
          quantity: i.quantity,
        })),
      },
    });
  };

  // Categories list
  const categoriesList = [
    { slug: "all", name: "Tất cả" },
    ...Array.from(
      new Set(availableProducts.map((p) => p.category.slug))
    ).map((slug) => {
      const match = availableProducts.find((p) => p.category.slug === slug);
      return { slug, name: match?.category.name || slug };
    }),
  ];

  const filteredProducts =
    activeCategoryTab === "all"
      ? availableProducts
      : availableProducts.filter(
          (p) => p.category.slug === activeCategoryTab
        );

  return (
    <div className="space-y-8">
      {/* Step Indicator Header */}
      <div className="bg-white rounded-3xl p-5 border border-nekicho-border shadow-soft">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { num: 1, label: "1. Box Style" },
            { num: 2, label: "2. Fill Box" },
            { num: 3, label: "3. Ribbon" },
            { num: 4, label: "4. Card & Note" },
            { num: 5, label: "5. Review" },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`py-2 px-1 rounded-2xl font-bold transition flex flex-col items-center justify-center gap-1 ${
                currentStep === s.num
                  ? "bg-nekicho-primary text-white shadow-soft"
                  : currentStep > s.num
                  ? "bg-nekicho-subtle text-nekicho-primary"
                  : "text-nekicho-muted hover:bg-nekicho-bg"
              }`}
            >
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden font-extrabold">{s.num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Step Content */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft min-h-[500px]">
          {/* STEP 1: SELECT BOX STYLE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-nekicho-primary">
                  Bước 1/5
                </span>
                <h2 className="text-2xl font-extrabold text-nekicho-text mt-1">
                  Chọn cỡ hộp
                </h2>
                <p className="text-xs text-nekicho-muted mt-1">
                  Mọi hộp đều là hộp cứng NekiCho, có giấy lót và xốp chống sốc.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {boxOptions.map((box) => {
                  const isSelected = selectedBox?.id === box.id;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBox(box)}
                      className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-nekicho-primary bg-nekicho-bg shadow-card"
                          : "border-nekicho-border hover:border-nekicho-light bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center border border-nekicho-border shadow-xs"
                          style={{ backgroundColor: box.colorHex || "#F39ABD" }}
                        >
                          <Gift className="w-6 h-6 text-nekicho-dark" />
                        </div>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-nekicho-primary text-white flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      <div className="mt-4">
                        <h3 className="font-bold text-sm text-nekicho-text">
                          {box.name}
                        </h3>
                        <p className="text-xs text-nekicho-muted mt-0.5">
                          Đựng tối đa {box.maxCapacity} món
                        </p>
                        <p className="text-sm font-extrabold text-nekicho-primary mt-2">
                          {formatVND(box.price)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-nekicho-subtle">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-full bg-nekicho-primary hover:bg-nekicho-dark text-white font-bold text-xs flex items-center space-x-2 shadow-soft transition"
                >
                  <span>Tiếp: chọn món</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FILL THE BOX */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-nekicho-primary">
                    Bước 2/5
                  </span>
                  <h2 className="text-2xl font-extrabold text-nekicho-text mt-1">
                    Chọn món cho vào hộp
                  </h2>
                </div>

                {/* Live Capacity Meter */}
                <div className="bg-nekicho-bg p-3 rounded-2xl border border-nekicho-border flex flex-col sm:items-end">
                  <div className="text-xs font-bold text-nekicho-text flex items-center space-x-1.5">
                    <span>Sức chứa:</span>
                    <span
                      className={`font-extrabold ${
                        isOverCapacity ? "text-red-500" : "text-nekicho-primary"
                      }`}
                    >
                      {currentCapacityUsed} / {maxCapacity} món
                    </span>
                  </div>
                  <div className="w-36 h-2 bg-nekicho-subtle rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOverCapacity ? "bg-red-500" : "bg-nekicho-primary"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (currentCapacityUsed / maxCapacity) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategoryTab(cat.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      activeCategoryTab === cat.slug
                        ? "bg-nekicho-primary text-white shadow-soft"
                        : "bg-nekicho-bg text-nekicho-muted hover:text-nekicho-text hover:bg-nekicho-subtle"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Products Grid for Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const existing = boxItems.find(
                    (i) => i.product.id === product.id
                  );
                  const isFull =
                    currentCapacityUsed + product.sizeUnits > maxCapacity;

                  return (
                    <div
                      key={product.id}
                      className="p-3 rounded-2xl border border-nekicho-border hover:border-nekicho-light bg-white flex flex-col justify-between transition shadow-xs"
                    >
                      <div>
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-nekicho-bg mb-2">
                          <NekiImage
                            src={
                              getProductAsset(
                                product.imageKey,
                                product.name,
                                product.category.name
                              ).src
                            }
                            alt={product.name}
                            fill
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-bold text-xs text-nekicho-text line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-xs text-nekicho-primary font-bold mt-0.5">
                          {formatVND(product.price)}
                        </p>
                      </div>

                      {/* Add/Remove Action */}
                      <div className="mt-3 pt-2 border-t border-nekicho-subtle flex items-center justify-between">
                        {existing ? (
                          <div className="flex items-center space-x-2 bg-nekicho-bg px-2 py-1 rounded-xl border border-nekicho-border">
                            <button
                              onClick={() => handleRemoveItem(product.id)}
                              className="text-nekicho-muted hover:text-nekicho-primary p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-nekicho-text">
                              {existing.quantity}
                            </span>
                            <button
                              onClick={() => handleAddItem(product)}
                              disabled={isFull}
                              className={`p-0.5 ${
                                isFull
                                  ? "text-gray-300"
                                  : "text-nekicho-muted hover:text-nekicho-primary"
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddItem(product)}
                            disabled={isFull}
                            className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                              isFull
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-nekicho-subtle hover:bg-nekicho-primary text-nekicho-primary hover:text-white"
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isFull ? "Hộp đã đầy" : "Cho vào hộp"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {notEnoughItems && (
                <div className="p-3 rounded-2xl bg-nekicho-bg border border-nekicho-border text-sm text-nekicho-text">
                  Hộp tự ghép cần <strong>ít nhất 2 món</strong> (đang có {totalItemCount}). Muốn tặng 1 món?{" "}
                  <Link href="/gift-sets" className="underline text-nekicho-primary font-semibold">
                    Chọn hộp làm sẵn
                  </Link>{" "}
                  từ 159.000 ₫, đã gồm hộp và thiệp.
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t border-nekicho-subtle">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-full border border-nekicho-border text-nekicho-text font-bold text-xs flex items-center space-x-1 hover:bg-nekicho-bg transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại chọn hộp</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={notEnoughItems}
                  className={`px-6 py-3 rounded-full text-white font-bold text-xs flex items-center space-x-2 shadow-soft transition ${
                    notEnoughItems
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-nekicho-primary hover:bg-nekicho-dark"
                  }`}
                >
                  <span>Tiếp: chọn ruy băng</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT RIBBON */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-nekicho-primary">
                  Bước 3/5
                </span>
                <h2 className="text-2xl font-extrabold text-nekicho-text mt-1">
                  Chọn ruy băng
                </h2>
                <p className="text-xs text-nekicho-muted mt-1">
                  Ruy băng được thắt tay bên ngoài hộp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ribbonOptions.map((ribbon) => {
                  const isSelected = selectedRibbon?.id === ribbon.id;
                  return (
                    <div
                      key={ribbon.id}
                      onClick={() => setSelectedRibbon(ribbon)}
                      className={`p-5 rounded-3xl border-2 transition cursor-pointer flex items-center space-x-4 ${
                        isSelected
                          ? "border-nekicho-primary bg-nekicho-bg shadow-card"
                          : "border-nekicho-border hover:border-nekicho-light bg-white"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-white shadow-soft"
                        style={{ backgroundColor: ribbon.colorHex || "#E33D7D" }}
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-nekicho-text">
                          {ribbon.name}
                        </h4>
                        <p className="text-xs font-bold text-nekicho-primary mt-0.5">
                          +{formatVND(ribbon.price)}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-nekicho-primary text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-nekicho-subtle">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-full border border-nekicho-border text-nekicho-text font-bold text-xs flex items-center space-x-1 hover:bg-nekicho-bg transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại chọn món</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-full bg-nekicho-primary hover:bg-nekicho-dark text-white font-bold text-xs flex items-center space-x-2 shadow-soft transition"
                >
                  <span>Tiếp: thiệp và lời nhắn</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: GREETING CARD & MESSAGE */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-nekicho-primary">
                  Bước 4/5
                </span>
                <h2 className="text-2xl font-extrabold text-nekicho-text mt-1">
                  Thiệp và lời nhắn
                </h2>
                <p className="text-xs text-nekicho-muted mt-1">
                  Chọn mẫu thiệp và viết lời nhắn để in lên thiệp.
                </p>
              </div>

              {/* Card Designs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cardOptions.map((card) => {
                  const isSelected = selectedCard?.id === card.id;
                  return (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-nekicho-primary bg-nekicho-bg shadow-soft"
                          : "border-nekicho-border hover:border-nekicho-light bg-white"
                      }`}
                    >
                      <div className="w-10 h-10 mx-auto rounded-xl bg-nekicho-subtle text-nekicho-primary flex items-center justify-center mb-2">
                        <Mail className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-xs text-nekicho-text line-clamp-1">
                        {card.name}
                      </h4>
                      <p className="text-xs text-nekicho-primary font-bold mt-1">
                        +{formatVND(card.price)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Live Card Message Typing Area */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-nekicho-cream via-white to-nekicho-bg border border-nekicho-border shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-nekicho-text flex items-center space-x-1.5">
                    <Heart className="w-3.5 h-3.5 text-nekicho-primary fill-nekicho-primary" />
                    <span>Lời nhắn của bạn (không bắt buộc)</span>
                  </span>
                  <span className="text-nekicho-muted">{cardMessage.length} / 150</span>
                </div>

                <textarea
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value.slice(0, 150))}
                  rows={4}
                  placeholder="VD: Chúc mẹ Giáng sinh ấm áp!"
                  className="w-full p-4 rounded-2xl border border-nekicho-border focus:border-nekicho-primary focus:ring-1 focus:ring-nekicho-primary outline-none text-xs sm:text-sm text-nekicho-text leading-relaxed bg-white"
                />

                <p className="text-xs text-nekicho-muted italic">
                  Lời nhắn sẽ được in lên thiệp &quot;{selectedCard?.name}&quot; và đặt trong hộp.
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-nekicho-subtle">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-full border border-nekicho-border text-nekicho-text font-bold text-xs flex items-center space-x-1 hover:bg-nekicho-bg transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại ruy băng</span>
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-3 rounded-full bg-nekicho-primary hover:bg-nekicho-dark text-white font-bold text-xs flex items-center space-x-2 shadow-soft transition"
                >
                  <span>Tiếp: xem lại hộp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & FINALIZE */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-nekicho-primary">
                  Bước 5/5
                </span>
                <h2 className="text-2xl font-extrabold text-nekicho-text mt-1">
                  Xem lại hộp của bạn
                </h2>
                <p className="text-xs text-nekicho-muted mt-1">
                  Kiểm tra lại các món trước khi thêm vào giỏ.
                </p>
              </div>

              <div className="space-y-4">
                {/* Box & Trimmings Summary */}
                <div className="p-4 rounded-2xl bg-nekicho-bg border border-nekicho-border space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-nekicho-muted">Hộp:</span>
                    <span className="font-bold text-nekicho-text">
                      {selectedBox.name} ({formatVND(selectedBox.price)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nekicho-muted">Ruy băng:</span>
                    <span className="font-bold text-nekicho-text">
                      {selectedRibbon?.name} ({formatVND(selectedRibbon?.price)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nekicho-muted">Thiệp:</span>
                    <span className="font-bold text-nekicho-text">
                      {selectedCard?.name} ({formatVND(selectedCard?.price)})
                    </span>
                  </div>
                </div>

                {/* Handcrafted Note Preview */}
                {cardMessage && (
                  <div className="p-4 rounded-2xl bg-white border border-dashed border-nekicho-primary/60 text-xs space-y-1">
                    <p className="font-bold text-nekicho-primary">💌 Handwritten Card Note:</p>
                    <p className="italic text-nekicho-text">&ldquo;{cardMessage}&rdquo;</p>
                  </div>
                )}

                {/* Goodies List */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-nekicho-muted">
                    Món trong hộp ({boxItems.length})
                  </h4>
                  <div className="space-y-2">
                    {boxItems.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white border border-nekicho-border text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-5 h-5 rounded-full bg-nekicho-subtle text-nekicho-primary flex items-center justify-center font-bold text-xs">
                            {quantity}x
                          </span>
                          <span className="font-semibold text-nekicho-text">
                            {product.name}
                          </span>
                        </div>
                        <span className="font-bold text-nekicho-primary">
                          {formatVND((product.price * quantity))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-nekicho-subtle">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-3 rounded-full border border-nekicho-border text-nekicho-text font-bold text-xs flex items-center justify-center space-x-1 hover:bg-nekicho-bg transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sửa lời nhắn</span>
                </button>

                <button
                  onClick={handleAddBoxToCart}
                  className="flex-1 py-4 px-6 rounded-full bg-nekicho-primary hover:bg-nekicho-dark text-white font-bold text-sm shadow-soft hover:shadow-elevated transition flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Thêm hộp vào giỏ • {formatVND(totalCustomBoxPrice)}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Persistent Live Box Overview */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-nekicho-border shadow-elevated space-y-5 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-nekicho-subtle">
            <h3 className="font-extrabold text-base text-nekicho-text flex items-center space-x-2">
              <Gift className="w-5 h-5 text-nekicho-primary" />
              <span>Tóm tắt hộp</span>
            </h3>
            <span className="text-xs bg-nekicho-subtle text-nekicho-primary font-bold px-2.5 py-0.5 rounded-full">
              {currentCapacityUsed}/{maxCapacity} món
            </span>
          </div>

          {/* Active Box & Ribbon Visual Pill */}
          <div className="p-3.5 rounded-2xl bg-nekicho-bg border border-nekicho-border flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs border border-white"
              style={{ backgroundColor: selectedBox?.colorHex || "#F39ABD" }}
            >
              <Gift className="w-5 h-5 text-nekicho-dark" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-nekicho-text truncate">
                {selectedBox?.name}
              </p>
              <p className="text-xs text-nekicho-muted truncate">
                🎀 {selectedRibbon?.name || "Chưa chọn ruy băng"}
              </p>
            </div>
          </div>

          {/* Selected Items Mini List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            <p className="text-xs font-bold text-nekicho-muted uppercase tracking-wider">
              Món trong hộp:
            </p>
            {boxItems.length === 0 ? (
              <p className="text-xs text-nekicho-muted italic text-center py-4 bg-nekicho-cream rounded-xl">
                Chưa có món nào. Hãy chọn món ở bước 2.
              </p>
            ) : (
              boxItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-nekicho-subtle/50"
                >
                  <span className="text-nekicho-text truncate max-w-[170px]">
                    {quantity}x {product.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-nekicho-primary">
                      {formatVND((product.price * quantity))}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(product.id)}
                      className="text-nekicho-muted hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Price Breakdown */}
          <div className="pt-3 border-t border-nekicho-subtle space-y-1.5 text-xs">
            <div className="flex justify-between text-nekicho-muted">
              <span>Hộp</span>
              <span>{formatVND(boxBasePrice)}</span>
            </div>
            <div className="flex justify-between text-nekicho-muted">
              <span>Ruy băng và thiệp</span>
              <span>{formatVND((ribbonPrice + cardPrice))}</span>
            </div>
            <div className="flex justify-between text-nekicho-muted">
              <span>Các món</span>
              <span>{formatVND(itemsTotalPrice)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-nekicho-text pt-2 border-t border-nekicho-subtle">
              <span>Tổng hộp</span>
              <span className="text-nekicho-primary">
                {formatVND(totalCustomBoxPrice)}
              </span>
            </div>
          </div>

          {/* Direct CTA */}
          <button
            onClick={handleAddBoxToCart}
            disabled={notEnoughItems}
            className={`w-full py-3.5 px-4 rounded-full font-bold text-xs flex items-center justify-center space-x-2 shadow-soft transition ${
              notEnoughItems
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-nekicho-primary hover:bg-nekicho-dark text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Thêm hộp vào giỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

