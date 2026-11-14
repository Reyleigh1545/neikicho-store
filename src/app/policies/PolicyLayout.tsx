import React from "react";
import Link from "next/link";

const TABS = [
  { href: "/policies/delivery", label: "Giao hàng" },
  { href: "/policies/returns", label: "Đổi trả" },
  { href: "/policies/privacy", label: "Quyền riêng tư" },
];

export default function PolicyLayout({
  title,
  active,
  children,
}: {
  title: string;
  active: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <nav className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
              t.href === active
                ? "bg-nekicho-primary text-white border-nekicho-primary"
                : "bg-white text-nekicho-text border-nekicho-border hover:border-nekicho-primary"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <article className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-5 text-sm text-nekicho-text leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-nekicho-dark [&_h2]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {children}
        <p className="text-xs text-nekicho-muted border-t border-nekicho-subtle pt-4">
          Student project – E-Business, Hanoi University. NekiCho là sản phẩm concept, chưa bán thật; chính sách dưới
          đây mô tả cách store sẽ vận hành khi ra mắt.
        </p>
      </article>
    </div>
  );
}
