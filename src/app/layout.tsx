import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "NekiCho • Hộp quà theo người nhận (Student project)",
  description:
    "Student project – E-Business, Hanoi University. Hộp quà Giáng sinh & Tết cho mẹ, người thương, bạn bè. Sản phẩm concept, không bán thật.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen bg-nekicho-bg text-nekicho-text antialiased selection:bg-nekicho-subtle selection:text-nekicho-primary">
        <AuthProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

