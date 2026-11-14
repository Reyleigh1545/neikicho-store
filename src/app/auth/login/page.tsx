"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, ArrowRight, ShieldCheck, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || "Login failed");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/logo.svg"
            alt="NekiCho"
            className="h-10 mx-auto w-auto"
          />
          <h1 className="text-2xl font-extrabold text-nekicho-text">
            Welcome Back
          </h1>
          <p className="text-xs text-nekicho-muted">
            Sign in to access your orders and account settings
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-nekicho-text mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-nekicho-muted absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-nekicho-border text-xs focus:border-nekicho-primary focus:ring-1 focus:ring-nekicho-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-nekicho-text mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-nekicho-muted absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-nekicho-border text-xs focus:border-nekicho-primary focus:ring-1 focus:ring-nekicho-primary outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-full font-bold text-xs text-white shadow-soft transition flex items-center justify-center space-x-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-nekicho-primary hover:bg-nekicho-dark"
            }`}
          >
            <span>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-nekicho-muted pt-2">
          Trang đăng nhập chỉ dành cho nhóm quản lý store. Khách không cần tài khoản để đặt đơn thử.
        </p>
      </div>
    </div>
  );
}

