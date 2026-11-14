"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { calculateShippingFee } from "@/config/shop";

export interface CustomBoxDetails {
  boxId: string;
  boxName: string;
  boxImageKey?: string;
  boxColor?: string;
  ribbonId?: string;
  ribbonName?: string;
  cardId?: string;
  cardName?: string;
  cardMessage?: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    imageKey?: string;
    quantity: number;
  }>;
}

export interface CartItem {
  id: string; // unique item id in cart
  productId?: string;
  variantId?: string;
  variantName?: string;
  name: string;
  price: number;
  quantity: number;
  imageKey?: string;
  isCustomBox: boolean;
  boxDetails?: CustomBoxDetails;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nekicho_cart_items_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // If it's a regular product and already in cart, increment quantity
      if (!newItem.isCustomBox && newItem.productId) {
        const existingIdx = prev.findIndex(
          (i) =>
            !i.isCustomBox &&
            i.productId === newItem.productId &&
            (i.variantId || null) === (newItem.variantId || null)
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + newItem.quantity,
          };
          return updated;
        }
      }

      // Otherwise create a new cart entry with unique id
      const uniqueId = newItem.isCustomBox
        ? `box_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
        : `prod_${newItem.productId}_${Date.now()}`;

      return [...prev, { ...newItem, id: uniqueId }];
    });

    // Auto-open drawer when adding item
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  const subtotal = items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );

  // Same rule as the server (src/config/shop.ts), so the total shown = the order total
  const shippingFee = items.length === 0 ? 0 : calculateShippingFee(subtotal);
  const grandTotal = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingFee,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

