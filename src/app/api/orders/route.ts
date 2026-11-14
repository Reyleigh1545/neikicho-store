import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SHOP_CONFIG, calculateShippingFee } from "@/config/shop";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      shippingAddress,
      city,
      notes,
      paymentMethod,
      items,
      userId,
    } = body;

    // 1. Basic Customer Input Validation
    // Project rule: the test store never collects real phone numbers or emails.
    if (!customerName || !shippingAddress) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên người nhận và địa chỉ (dùng thông tin giả)." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Giỏ hàng của bạn đang trống." },
        { status: 400 }
      );
    }

    // 2. Server-side Price & Stock Calculation
    // We recalculate every item price directly from the database to prevent client tampering.
    let serverSubtotal = 0;
    const validatedItems: Array<{
      productId?: string | null;
      variantId?: string | null;
      name: string;
      price: number;
      quantity: number;
      isCustomBox: boolean;
      variantName?: string | null;
      variantColor?: string | null;
      variantSize?: string | null;
      variantScent?: string | null;
      boxDetails?: string | null;
      giftBoxData?: any;
    }> = [];

    // Stock deduction queue
    const stockDeductions: Array<{ productId: string; variantId?: string | null; quantity: number }> = [];

    for (const rawItem of items) {
      const quantity = Math.max(1, parseInt(rawItem.quantity) || 1);

      if (rawItem.isCustomBox && rawItem.boxDetails) {
        // --- CUSTOM GIFT BOX VALIDATION ---
        const boxDetails = typeof rawItem.boxDetails === "string"
          ? JSON.parse(rawItem.boxDetails)
          : rawItem.boxDetails;

        // Fetch selected box option
        const boxOpt = await prisma.giftBoxOption.findFirst({
          where: {
            OR: [
              { id: boxDetails.boxId || "" },
              { name: boxDetails.boxName || "" },
              { slug: boxDetails.boxSlug || "" },
            ],
            type: "BOX",
          },
        });

        const boxPrice = boxOpt ? boxOpt.price : 45000;
        const maxCapacity = boxOpt ? boxOpt.maxCapacity : 4;

        // Fetch selected ribbon
        let ribbonPrice = 0;
        let ribbonName: string | null = boxDetails.ribbonName || null;
        if (boxDetails.ribbonId || boxDetails.ribbonName) {
          const ribbonOpt = await prisma.giftBoxOption.findFirst({
            where: {
              OR: [
                { id: boxDetails.ribbonId || "" },
                { name: boxDetails.ribbonName || "" },
              ],
              type: "RIBBON",
            },
          });
          if (ribbonOpt) {
            ribbonPrice = ribbonOpt.price;
            ribbonName = ribbonOpt.name;
          }
        }

        // Fetch selected card
        let cardPrice = 0;
        let cardName: string | null = boxDetails.cardName || null;
        if (boxDetails.cardId || boxDetails.cardName) {
          const cardOpt = await prisma.giftBoxOption.findFirst({
            where: {
              OR: [
                { id: boxDetails.cardId || "" },
                { name: boxDetails.cardName || "" },
              ],
              type: "CARD",
            },
          });
          if (cardOpt) {
            cardPrice = cardOpt.price;
            cardName = cardOpt.name;
          }
        }

        // Validate included items inside the box
        let boxItemsSum = 0;
        let capacityUsed = 0;
        const boxIncludedItems: any[] = [];

        if (Array.isArray(boxDetails.items)) {
          for (const boxInnerItem of boxDetails.items) {
            const innerQty = Math.max(1, parseInt(boxInnerItem.quantity) || 1);
            const dbProduct = await prisma.product.findUnique({
              where: { id: boxInnerItem.productId },
              include: { variants: true },
            });

            if (!dbProduct || !dbProduct.isActive) {
              return NextResponse.json(
                { error: `Sản phẩm "${boxInnerItem.name || "trong hộp quà"}" không còn khả dụng.` },
                { status: 400 }
              );
            }

            let itemUnitPrice = dbProduct.price;
            let variantSnapshotName: string | null = null;
            if (boxInnerItem.variantId) {
              const matchedVar = dbProduct.variants.find((v) => v.id === boxInnerItem.variantId);
              if (matchedVar) {
                itemUnitPrice = matchedVar.price || dbProduct.price;
                variantSnapshotName = matchedVar.name;
              }
            }

            capacityUsed += dbProduct.sizeUnits * innerQty;
            boxItemsSum += itemUnitPrice * innerQty;

            boxIncludedItems.push({
              productId: dbProduct.id,
              variantId: boxInnerItem.variantId || null,
              productName: dbProduct.name,
              variantName: variantSnapshotName,
              quantity: innerQty,
              price: itemUnitPrice,
            });

            stockDeductions.push({
              productId: dbProduct.id,
              variantId: boxInnerItem.variantId || null,
              quantity: innerQty * quantity,
            });
          }
        }

        // Validate box capacity
        if (capacityUsed > maxCapacity) {
          return NextResponse.json(
            {
              error: `Hộp quà đã vượt dung lượng tối đa (${capacityUsed}/${maxCapacity} units). Vui lòng đổi hộp lớn hơn hoặc bớt quà.`,
            },
            { status: 400 }
          );
        }

        const calculatedBoxTotal = boxPrice + ribbonPrice + cardPrice + boxItemsSum;
        const boxTitle = `Hộp Quà Custom NekiCho: ${boxOpt?.name || "Bespoke Gift Box"}`;

        serverSubtotal += calculatedBoxTotal * quantity;

        validatedItems.push({
          productId: null,
          variantId: null,
          name: boxTitle,
          price: calculatedBoxTotal,
          quantity,
          isCustomBox: true,
          boxDetails: JSON.stringify({
            boxName: boxOpt?.name || "Hộp Quà Pastel",
            boxPrice,
            ribbonName,
            ribbonPrice,
            cardName,
            cardPrice,
            cardMessage: boxDetails.cardMessage || null,
            items: boxIncludedItems,
          }),
          giftBoxData: {
            boxOptionId: boxOpt?.id || null,
            boxName: boxOpt?.name || "Hộp Quà Pastel",
            boxPrice,
            ribbonName,
            ribbonPrice,
            cardName,
            cardPrice,
            cardMessage: boxDetails.cardMessage || null,
            maxCapacity,
            totalPrice: calculatedBoxTotal,
            items: boxIncludedItems,
          },
        });
      } else {
        // --- REGULAR PRODUCT ITEM VALIDATION ---
        if (!rawItem.productId) {
          return NextResponse.json(
            { error: "Mã sản phẩm không hợp lệ trong đơn hàng." },
            { status: 400 }
          );
        }

        const dbProduct = await prisma.product.findUnique({
          where: { id: rawItem.productId },
          include: { variants: true },
        });

        if (!dbProduct || !dbProduct.isActive) {
          return NextResponse.json(
            { error: `Sản phẩm "${rawItem.name || rawItem.productId}" không tồn tại hoặc đã ngừng bán.` },
            { status: 400 }
          );
        }

        let finalUnitPrice = dbProduct.price;
        let variantName: string | null = null;
        let variantColor: string | null = null;
        let variantSize: string | null = null;
        let variantScent: string | null = null;

        if (rawItem.variantId) {
          const matchedVariant = dbProduct.variants.find((v) => v.id === rawItem.variantId);
          if (matchedVariant) {
            finalUnitPrice = matchedVariant.price || dbProduct.price;
            variantName = matchedVariant.name;
            variantColor = matchedVariant.color;
            variantSize = matchedVariant.size;
            variantScent = matchedVariant.scent;
          }
        }

        serverSubtotal += finalUnitPrice * quantity;

        stockDeductions.push({
          productId: dbProduct.id,
          variantId: rawItem.variantId || null,
          quantity,
        });

        validatedItems.push({
          productId: dbProduct.id,
          variantId: rawItem.variantId || null,
          name: dbProduct.name,
          price: finalUnitPrice,
          quantity,
          isCustomBox: false,
          variantName,
          variantColor,
          variantSize,
          variantScent,
        });
      }
    }

    // 3. Shipping Fee & Grand Total Calculation
    const serverShippingFee = calculateShippingFee(serverSubtotal);
    const serverTotal = serverSubtotal + serverShippingFee;

    // Generate unique order number (e.g. NKC-2026-1042)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `NKC-${new Date().getFullYear()}-${randomSuffix}`;

    // 4. Atomic Prisma Transaction (Validate Stock, Decrement Stock, Create Order & Items)
    const order = await prisma.$transaction(async (tx) => {
      // Stock checks & deductions
      for (const deduction of stockDeductions) {
        const prod = await tx.product.findUnique({
          where: { id: deduction.productId },
          select: { id: true, name: true, stock: true },
        });

        if (!prod || prod.stock < deduction.quantity) {
          throw new Error(
            `Sản phẩm "${prod?.name || "Sản phẩm"}" không đủ số lượng trong kho (chỉ còn ${prod?.stock || 0}).`
          );
        }

        await tx.product.update({
          where: { id: deduction.productId },
          data: {
            stock: {
              decrement: deduction.quantity,
            },
          },
        });

        if (deduction.variantId) {
          await tx.productVariant.update({
            where: { id: deduction.variantId },
            data: {
              stock: {
                decrement: deduction.quantity,
              },
            },
          }).catch(() => {});
        }
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          customerName: customerName.trim(),
          customerEmail: "",
          customerPhone: "",
          shippingAddress: shippingAddress.trim(),
          city: city?.trim() || null,
          notes: notes?.trim() || null,
          paymentMethod: paymentMethod === "BANK_TRANSFER" ? "BANK_TRANSFER" : "COD",
          paymentStatus: "PENDING", // test mode: nothing is ever paid
          status: "PROCESSING",
          subtotal: serverSubtotal,
          shippingFee: serverShippingFee,
          total: serverTotal,
        },
      });

      // Create OrderItems
      for (const item of validatedItems) {
        const createdOrderItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId || null,
            variantId: item.variantId || null,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            isCustomBox: item.isCustomBox,
            variantName: item.variantName || null,
            variantColor: item.variantColor || null,
            variantSize: item.variantSize || null,
            variantScent: item.variantScent || null,
            boxDetails: item.boxDetails || null,
          },
        });

        // If custom gift box, create the structured GiftBox entity
        if (item.isCustomBox && item.giftBoxData) {
          const gbData = item.giftBoxData;
          await tx.giftBox.create({
            data: {
              userId: userId || null,
              orderItemId: createdOrderItem.id,
              boxOptionId: gbData.boxOptionId || null,
              boxName: gbData.boxName,
              boxPrice: gbData.boxPrice,
              ribbonName: gbData.ribbonName,
              ribbonPrice: gbData.ribbonPrice || 0,
              cardName: gbData.cardName,
              cardPrice: gbData.cardPrice || 0,
              cardMessage: gbData.cardMessage,
              maxCapacity: gbData.maxCapacity || 4,
              totalPrice: gbData.totalPrice,
              items: {
                create: gbData.items.map((inner: any) => ({
                  productId: inner.productId,
                  variantId: inner.variantId || null,
                  productName: inner.productName,
                  variantName: inner.variantName || null,
                  quantity: inner.quantity,
                  price: inner.price,
                })),
              },
            },
          });
        }
      }

      return newOrder;
    }, { maxWait: 10000, timeout: 20000 }); // hosted DB (Neon) can be slow on a cold start

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error: any) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const orderNumber = searchParams.get("orderNumber");

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
              giftBox: {
                include: {
                  items: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });
      }

      return NextResponse.json({ order });
    }

    // Never return every order to an anonymous visitor (testers must not see each other's orders)
    if (!userId) {
      return NextResponse.json({ error: "Thiếu mã đơn hoặc tài khoản." }, { status: 400 });
    }
    const where: any = { userId };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi khi lấy danh sách đơn hàng." },
      { status: 500 }
    );
  }
}
