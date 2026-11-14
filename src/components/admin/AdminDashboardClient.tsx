"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Gift,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  Layers,
  Edit2,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import NekiImage from "@/components/ui/NekiImage";
import { getProductAsset, PRODUCT_IMAGES } from "@/config/images";
import { formatVND } from "@/config/shop";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city?: string | null;
  notes?: string | null;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string | Date;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    isCustomBox: boolean;
    boxDetails?: string | null;
  }>;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageKey?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  boxCompatible: boolean;
  sizeUnits: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
}

interface AdminDashboardClientProps {
  initialOrders: AdminOrder[];
  initialProducts: AdminProduct[];
  categories: AdminCategory[];
}

export default function AdminDashboardClient({
  initialOrders,
  initialProducts,
  categories,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "assets">("orders");

  // Local state for instant updates
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);

  // Filter/search
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    categoryId: categories[0]?.id || "",
    price: 15.0,
    stock: 20,
    description: "",
    imageKey: Object.keys(PRODUCT_IMAGES)[0] || "",
    boxCompatible: true,
    sizeUnits: 1,
    isFeatured: false,
  });

  // KPI calculations
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PROCESSING"
  ).length;

  // Order status update
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Payment status update
  const handlePaymentStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentStatus: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: newStatus } : o
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Product stock update
  const handleUpdateStock = async (productId: string, delta: number) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );

    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, stock: newStock }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Product toggle active
  const handleToggleProductActive = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const nextActive = !target.isActive;

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isActive: nextActive } : p))
    );

    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, isActive: nextActive }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Add Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (res.ok && data.product) {
        const cat = categories.find((c) => c.id === newProduct.categoryId);
        setProducts((prev) => [
          { ...data.product, category: cat || { id: "", name: "Gift", slug: "" } },
          ...prev,
        ]);
        setShowAddProductModal(false);
      } else {
        alert(data.error || "Failed to create product");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());

    const matchStatus =
      orderStatusFilter === "ALL" || order.status === orderStatusFilter;

    return matchSearch && matchStatus;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    return (
      productCategoryFilter === "ALL" ||
      p.category.slug === productCategoryFilter
    );
  });

  return (
    <div className="space-y-8">
      {/* Top KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-nekicho-border shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-nekicho-muted font-medium">Total Revenue</p>
            <p className="text-2xl font-extrabold text-nekicho-text mt-0.5">
              {formatVND(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-nekicho-border shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-nekicho-subtle text-nekicho-primary flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-nekicho-muted font-medium">Total Orders</p>
            <p className="text-2xl font-extrabold text-nekicho-text mt-0.5">
              {orders.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-nekicho-border shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-nekicho-muted font-medium">Pending Delivery</p>
            <p className="text-2xl font-extrabold text-nekicho-text mt-0.5">
              {pendingOrdersCount}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-nekicho-border shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-nekicho-primary flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-nekicho-muted font-medium">Active Products</p>
            <p className="text-2xl font-extrabold text-nekicho-text mt-0.5">
              {products.filter((p) => p.isActive).length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white rounded-3xl p-2 border border-nekicho-border shadow-soft flex space-x-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
            activeTab === "orders"
              ? "bg-nekicho-primary text-white shadow-soft"
              : "text-nekicho-muted hover:text-nekicho-text hover:bg-nekicho-bg"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
            activeTab === "products"
              ? "bg-nekicho-primary text-white shadow-soft"
              : "text-nekicho-muted hover:text-nekicho-text hover:bg-nekicho-bg"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Products &amp; Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("assets")}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
            activeTab === "assets"
              ? "bg-nekicho-primary text-white shadow-soft"
              : "text-nekicho-muted hover:text-nekicho-text hover:bg-nekicho-bg"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image Registry &amp; Teammate Guide</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-nekicho-text">
                All Customer Orders
              </h2>
              <p className="text-xs text-nekicho-muted">
                Inspect customer details, update shipping stage, and review bespoke gift boxes.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search orders..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl border border-nekicho-border text-xs focus:border-nekicho-primary outline-none"
              />

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-nekicho-border text-xs font-semibold text-nekicho-text outline-none bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <p className="text-xs text-nekicho-muted text-center py-10">
                No matching orders found.
              </p>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-nekicho-border hover:border-nekicho-light transition bg-nekicho-cream/30 space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-nekicho-subtle">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-nekicho-text">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-nekicho-muted">
                          • {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-nekicho-muted mt-0.5">
                        Customer: <strong className="text-nekicho-text">{order.customerName}</strong> ({order.customerEmail}) • {order.customerPhone}
                      </p>
                    </div>

                    {/* Interactive Dropdown Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-1 text-xs">
                        <span className="text-nekicho-muted">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleOrderStatusChange(order.id, e.target.value)
                          }
                          className="px-2.5 py-1 rounded-lg border border-nekicho-border font-bold text-xs bg-white text-nekicho-primary outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-1 text-xs">
                        <span className="text-nekicho-muted">Payment:</span>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            handlePaymentStatusChange(order.id, e.target.value)
                          }
                          className="px-2.5 py-1 rounded-lg border border-nekicho-border font-bold text-xs bg-white text-green-700 outline-none"
                        >
                          <option value="PENDING">UNPAID</option>
                          <option value="PAID">PAID</option>
                        </select>
                      </div>

                      <span className="font-extrabold text-sm text-nekicho-primary ml-2">
                        {formatVND(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Address & Notes */}
                  <div className="text-xs text-nekicho-muted grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-nekicho-subtle">
                    <p>
                      <strong>Shipping Address:</strong> {order.shippingAddress} {order.city}
                    </p>
                    <p>
                      <strong>Note:</strong> {order.notes || "None"}
                    </p>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-nekicho-muted uppercase tracking-wider">
                      Ordered Items ({order.items.length}):
                    </p>
                    <div className="space-y-1 text-xs">
                      {order.items.map((it) => (
                        <div
                          key={it.id}
                          className="flex justify-between items-center py-1 border-b border-nekicho-subtle/50"
                        >
                          <span className="text-nekicho-text font-medium">
                            {it.quantity}x {it.name}{" "}
                            {it.isCustomBox && (
                              <span className="text-[10px] bg-pink-100 text-nekicho-primary px-1.5 py-0.5 rounded font-bold ml-1">
                                Bespoke Box
                              </span>
                            )}
                          </span>
                          <span className="font-semibold text-nekicho-primary">
                            {formatVND((it.price * it.quantity))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & INVENTORY MANAGEMENT */}
      {activeTab === "products" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-nekicho-text">
                Product Catalog &amp; Inventory
              </h2>
              <p className="text-xs text-nekicho-muted">
                Update stock levels, toggle active status, or add new catalog items.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-nekicho-border text-xs font-semibold text-nekicho-text outline-none bg-white"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-nekicho-primary hover:bg-nekicho-dark text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-soft transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-nekicho-subtle text-nekicho-muted uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Item</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Stock Level</th>
                  <th className="py-3 px-2">Box Ready</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nekicho-subtle/60">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-nekicho-bg/50 transition">
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-nekicho-bg border border-nekicho-border">
                          <NekiImage
                            src={
                              getProductAsset(
                                p.imageKey,
                                p.name,
                                p.category.name
                              ).src
                            }
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-nekicho-text">{p.name}</p>
                          <p className="text-[10px] text-nekicho-muted">
                            Key: {p.imageKey || "none"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium text-nekicho-muted">
                      {p.category.name}
                    </td>
                    <td className="py-3 px-2 font-bold text-nekicho-primary">
                      {formatVND(p.price)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleUpdateStock(p.id, -1)}
                          className="w-6 h-6 rounded bg-nekicho-subtle text-nekicho-primary font-bold flex items-center justify-center hover:bg-nekicho-primary hover:text-white"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs min-w-[2rem] text-center">
                          {p.stock}
                        </span>
                        <button
                          onClick={() => handleUpdateStock(p.id, 1)}
                          className="w-6 h-6 rounded bg-nekicho-subtle text-nekicho-primary font-bold flex items-center justify-center hover:bg-nekicho-primary hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {p.boxCompatible ? (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                          Yes ({p.sizeUnits}u)
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleToggleProductActive(p.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                          p.isActive
                            ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
                            : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"
                        }`}
                      >
                        {p.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <a
                        href={`/products/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-nekicho-primary hover:text-nekicho-dark p-1"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-4 h-4 inline" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TEAMMATE IMAGE HANDOVER GUIDE */}
      {activeTab === "assets" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-nekicho-border shadow-soft space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-nekicho-subtle text-nekicho-primary flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-nekicho-text">
                Centralized Asset &amp; Photography Handover
              </h2>
              <p className="text-xs text-nekicho-muted">
                Documentation &amp; image registry configuration for photography team members.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-nekicho-bg border border-nekicho-border text-xs space-y-3">
            <h4 className="font-bold text-nekicho-primary uppercase tracking-wider text-[11px]">
              How teammates replace placeholders with real photos:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-nekicho-text leading-relaxed">
              <li>
                Export your edited product photography in JPG, PNG, or WebP (recommended 800×800 square).
              </li>
              <li>
                Place the image files in the directory:{" "}
                <code className="bg-white px-2 py-0.5 rounded border border-nekicho-border font-mono text-nekicho-primary">
                  public/images/products/
                </code>
              </li>
              <li>
                Open the centralized registry:{" "}
                <code className="bg-white px-2 py-0.5 rounded border border-nekicho-border font-mono text-nekicho-primary">
                  src/config/images.ts
                </code>
              </li>
              <li>
                Update the path corresponding to each product key (e.g. <code className="font-mono">candle-rose-blush</code>).
              </li>
            </ol>
            <p className="text-[11px] text-nekicho-muted italic">
              ✨ If an asset file hasn&apos;t been provided yet, NekiCho automatically generates an elegant pastel SVG placeholder with the brand palette.
            </p>
          </div>

          {/* Current Registry Keys Overview */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-nekicho-text">
              Active Registered Keys ({Object.keys(PRODUCT_IMAGES).length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(PRODUCT_IMAGES).map(([key, asset]) => (
                <div
                  key={key}
                  className="p-3 rounded-2xl border border-nekicho-border bg-white text-xs flex items-center space-x-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-nekicho-bg flex-shrink-0 border border-nekicho-subtle overflow-hidden">
                    <NekiImage
                      src={asset.src}
                      alt={asset.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-nekicho-text truncate">{key}</p>
                    <p className="text-[10px] text-nekicho-muted truncate">
                      {asset.src}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-nekicho-border shadow-elevated space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-nekicho-subtle">
              <h3 className="font-bold text-base text-nekicho-text">
                Add New Product to NekiCho
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-nekicho-muted hover:text-nekicho-text"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-nekicho-text mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="e.g. Sakura Petal Ceramic Mug"
                  className="w-full px-3 py-2 rounded-xl border border-nekicho-border outline-none focus:border-nekicho-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-nekicho-text mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-nekicho-border outline-none focus:border-nekicho-primary bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-nekicho-text mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-nekicho-border outline-none focus:border-nekicho-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-nekicho-text mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-nekicho-border outline-none focus:border-nekicho-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-nekicho-text mb-1">
                    Image Key Registry
                  </label>
                  <input
                    type="text"
                    value={newProduct.imageKey}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageKey: e.target.value })
                    }
                    placeholder="e.g. candle-rose-blush"
                    className="w-full px-3 py-2 rounded-xl border border-nekicho-border outline-none focus:border-nekicho-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-nekicho-text mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Artisanal details..."
                  className="w-full px-3 py-2 rounded-xl border border-nekicho-border outline-none focus:border-nekicho-primary"
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.boxCompatible}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        boxCompatible: e.target.checked,
                      })
                    }
                    className="accent-nekicho-primary"
                  />
                  <span>Gift Box Compatible</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isFeatured}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="accent-nekicho-primary"
                  />
                  <span>Featured on Home</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-nekicho-subtle">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-full border border-nekicho-border font-bold hover:bg-nekicho-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-nekicho-primary text-white font-bold hover:bg-nekicho-dark shadow-soft"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

