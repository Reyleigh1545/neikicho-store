"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import NekiLogo from "@/components/ui/NekiLogo";
import {
  ShoppingBag,
  Sparkles,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Package,
  Heart,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: Array<{ name: string; href: string; badge?: string }> = [
    { name: "Trang chủ", href: "/" },
    { name: "3 hộp quà", href: "/shop?category=gift-sets" },
    { name: "Tất cả sản phẩm", href: "/shop" },
    { name: "Tự ghép hộp", href: "/custom-box" },
    { name: "Chính sách", href: "/policies" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-nekicho-border transition-all">
      {/* Top University Announcement Bar */}
      <div className="bg-gradient-to-r from-nekicho-subtle via-nekicho-bg to-nekicho-subtle text-nekicho-dark py-1 px-4 text-xs font-medium text-center border-b border-nekicho-border/50 flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-nekicho-primary animate-pulse" />
        <span>Student project – E-Business, Hanoi University · Sản phẩm concept, không bán thật</span>
        <span className="hidden sm:inline-block text-nekicho-muted">|</span>
        <span className="hidden sm:inline-block text-nekicho-muted">Chỉ giao nội thành Hà Nội · Miễn phí ship từ 500.000 ₫</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NekiLogo className="h-12 w-auto" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-semibold transition flex items-center space-x-1.5 ${
                    isActive
                      ? "bg-nekicho-subtle text-nekicho-primary font-bold shadow-xs"
                      : "text-nekicho-text hover:text-nekicho-primary hover:bg-nekicho-bg"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-nekicho-primary text-white shadow-soft">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center space-x-3">
            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 p-2 rounded-full hover:bg-nekicho-bg text-nekicho-text transition"
                    aria-label="User account"
                  >
                    <div className="w-8 h-8 rounded-full bg-nekicho-subtle border border-nekicho-border flex items-center justify-center text-nekicho-primary font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold max-w-[90px] truncate hidden lg:inline-block">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-elevated border border-nekicho-border py-2 z-50 text-sm"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-nekicho-subtle">
                        <p className="font-bold text-nekicho-text truncate">{user.name}</p>
                        <p className="text-xs text-nekicho-muted truncate">{user.email}</p>
                        {user.role === "ADMIN" && (
                          <span className="inline-block mt-1 text-[10px] bg-nekicho-primary text-white font-bold px-2 py-0.5 rounded-full">
                            ADMINISTRATOR
                          </span>
                        )}
                      </div>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="px-4 py-2 hover:bg-nekicho-bg text-nekicho-primary font-bold flex items-center space-x-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Quản lý (nhóm)</span>
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        className="px-4 py-2 hover:bg-nekicho-bg text-nekicho-text flex items-center space-x-2"
                      >
                        <Package className="w-4 h-4 text-nekicho-muted" />
                        <span>Tra cứu đơn</span>
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-nekicho-cream hover:bg-nekicho-subtle text-nekicho-primary transition border border-nekicho-border shadow-soft"
              aria-label="Mở giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-nekicho-primary text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scaleIn">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-nekicho-text hover:text-nekicho-primary"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-nekicho-border bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold ${
                  pathname === link.href
                    ? "bg-nekicho-subtle text-nekicho-primary font-bold"
                    : "text-nekicho-text hover:bg-nekicho-bg"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-nekicho-primary text-white">
                      {link.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

        </div>
      )}
    </header>
  );
}
