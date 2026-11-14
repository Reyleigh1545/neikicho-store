"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Search } from "lucide-react";

/**
 * Order lookup by order number.
 * The full order list is only visible to the team in /admin, so testers never see each other's test orders.
 */
export default function OrdersLookupPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().replace(/^#/, "").toUpperCase();
    if (clean) router.push(`/orders/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-nekicho-subtle text-nekicho-primary flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-nekicho-text">Tra cứu đơn thử</h1>
        <p className="text-sm text-nekicho-muted">
          Nhập mã đơn hiện ra sau khi đặt (VD: NKC-2026-1234).
        </p>
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="NKC-2026-…"
          className="flex-1 px-4 py-3 rounded-xl border border-nekicho-border text-sm focus:border-nekicho-primary outline-none"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-xl bg-nekicho-primary text-white font-bold text-sm flex items-center space-x-1"
        >
          <Search className="w-4 h-4" />
          <span>Tra cứu</span>
        </button>
      </form>
    </div>
  );
}
