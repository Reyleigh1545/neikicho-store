import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/product/ProductGallery";
import { getProductAsset, PRODUCT_IMAGES } from "@/config/images";
import ProductDetailActions from "@/components/product/ProductDetailActions";
import ProductCard from "@/components/product/ProductCard";
import { formatVND, SHOP_CONFIG } from "@/config/shop";
import {
  Sparkles,
  Gift,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { where: { isActive: true }, orderBy: { price: "asc" } },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { category: true },
    take: 4,
  });

  const asset = getProductAsset(
    product.imageKey,
    product.name,
    product.category.name
  );
  const isGiftSet = product.category.slug === "gift-sets";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-nekicho-muted">
        <Link href="/" className="hover:text-nekicho-primary transition">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-nekicho-primary transition">
          Cửa hàng
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="hover:text-nekicho-primary transition"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-nekicho-text font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Product Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Product Image Gallery Frame */}
        <div className="lg:col-span-6">
          <ProductGallery
            images={
              isGiftSet
                ? [
                    { src: asset.src, alt: asset.alt || product.name, caption: "Các món bạn có thể chọn trong hộp này" },
                    { src: PRODUCT_IMAGES["box-closed"].src, alt: PRODUCT_IMAGES["box-closed"].alt, caption: "Bên ngoài: hộp cứng NekiCho màu hồng" },
                    { src: PRODUCT_IMAGES["box-open-empty"].src, alt: PRODUCT_IMAGES["box-open-empty"].alt, caption: "Bên trong: lót giấy chống sốc, đặt món và thiệp" },
                  ]
                : [{ src: asset.src, alt: asset.alt || product.name, caption: product.name }]
            }
          />
        </div>

        {/* Product Details & Purchase Actions */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-6">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-nekicho-primary bg-nekicho-subtle px-3 py-1 rounded-full">
              {product.category.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-nekicho-text mt-3">
              {product.name}
            </h1>
            {!isGiftSet && (
              <div className="mt-3 p-3 rounded-2xl bg-nekicho-bg border border-nekicho-border text-sm text-nekicho-text">
                <strong>Món lẻ:</strong> giá này là của riêng món, không kèm hộp quà và thiệp. Muốn có hộp và thiệp, hãy chọn{" "}
                <Link href="/shop?category=gift-sets" className="underline text-nekicho-primary font-semibold">
                  hộp làm sẵn
                </Link>{" "}
                (từ 159.000 ₫, giá đã gồm hộp và thiệp) hoặc{" "}
                <Link href="/custom-box" className="underline text-nekicho-primary font-semibold">
                  tự ghép hộp
                </Link>
                .
              </div>
            )}
            <div className="flex items-baseline space-x-3 mt-2">
              <span className="text-3xl font-extrabold text-nekicho-primary">
                {product.variants.length > 1 &&
                new Set(product.variants.map((v) => v.price ?? product.price)).size > 1
                  ? `Từ ${formatVND(Math.min(...product.variants.map((v) => v.price ?? product.price)))}`
                  : formatVND(product.price)}
              </span>
              <span className="text-xs text-nekicho-muted">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-semibold">
                    ● Còn hàng
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">● Hết hàng</span>
                )}
              </span>
            </div>
          </div>

          <div className="border-t border-nekicho-subtle pt-4">
            <h3 className="text-xs font-bold text-nekicho-muted uppercase tracking-wider mb-2">
              Mô tả sản phẩm
            </h3>
            <p className="text-sm text-nekicho-text leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Delivery & returns, shown on the product page (research I4, I6) */}
          <div className="rounded-2xl bg-nekicho-bg border border-nekicho-border p-4 space-y-2 text-xs text-nekicho-text">
            <div className="flex items-start space-x-2">
              <Truck className="w-4 h-4 text-nekicho-primary flex-shrink-0 mt-0.5" />
              <span>
                Chỉ giao trong nội thành Hà Nội: có thể giao trong ngày, hoặc chọn ngày nhận khi thanh toán. Phí ship{" "}
                {formatVND(SHOP_CONFIG.defaultShippingFee)}, miễn phí cho đơn từ{" "}
                {formatVND(SHOP_CONFIG.freeShippingThreshold)}.
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-nekicho-primary flex-shrink-0 mt-0.5" />
              <span>Hộp cứng, lót giấy và xốp chống sốc. Hũ nến thủy tinh được bọc riêng chống vỡ; ly và bình inox được chèn chặt chống móp.</span>
            </div>
            <div className="flex items-start space-x-2">
              <RotateCcw className="w-4 h-4 text-nekicho-primary flex-shrink-0 mt-0.5" />
              <span>
                Giao sai món, hỏng khi vận chuyển hoặc khác ảnh: đổi mới miễn phí trong 48 giờ.{" "}
                <Link href="/policies/returns" className="underline text-nekicho-primary">
                  Xem chính sách đổi trả
                </Link>
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-nekicho-primary flex-shrink-0 mt-0.5" />
              <span>Ảnh là ảnh minh họa của concept (Student project), chưa phải ảnh chụp sản phẩm thật.</span>
            </div>
          </div>

          {/* Interactive Client Actions */}
          <ProductDetailActions
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              imageKey: product.imageKey,
              stock: product.stock,
              boxCompatible: product.boxCompatible,
              variants: product.variants.map((v) => ({
                id: v.id,
                name: v.name,
                price: v.price,
                stock: v.stock,
              })),
            }}
          />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-nekicho-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-nekicho-text">
              Có thể bạn cũng thích
            </h2>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-xs font-bold text-nekicho-primary hover:text-nekicho-dark"
            >
              Xem thêm {product.category.name} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                id={rel.id}
                name={rel.name}
                slug={rel.slug}
                description={rel.description}
                price={rel.price}
                imageKey={rel.imageKey}
                category={rel.category}
                isFeatured={rel.isFeatured}
                boxCompatible={rel.boxCompatible}
                stock={rel.stock}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

