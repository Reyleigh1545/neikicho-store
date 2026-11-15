const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Seeding NekiCho Vietnam Database (VND & Real Product Catalog)...");

  // 1. Clean existing records in referential order
  await prisma.giftBoxItem.deleteMany();
  await prisma.giftBox.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.giftBoxOption.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Demo Accounts (Password hashed with bcryptjs)
  // Set ADMIN_PASSWORD in the hosting environment variables; "admin123" is only a local fallback.
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  
  const admin = await prisma.user.create({
    data: {
      email: "admin@nekicho.com",
      name: "NekiCho Admin",
      password: adminPassword,
      role: "ADMIN",
      phone: null,
      address: null,
    },
  });

  console.log("✅ Admin account created (for the team only)");

  // 3. Categories, products and box options come from catalog.js
  const { categoriesData, productsWithVariants, boxOptionsData } = require("./catalog");

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: { ...cat, isActive: true } });
    categories[cat.slug] = created;
  }
  console.log(`✅ ${categoriesData.length} categories created.`);

  const createdProducts = [];
  for (const item of productsWithVariants) {
    const { variants, categorySlug, ...productFields } = item;
    const product = await prisma.product.create({
      data: {
        ...productFields,
        categoryId: categories[categorySlug].id,
        variants: { create: variants || [] },
      },
      include: { variants: true },
    });
    createdProducts.push(product);
  }
  console.log(`✅ ${createdProducts.length} products with variants created.`);

  // 5. Custom box builder options
  for (const opt of boxOptionsData) {
    await prisma.giftBoxOption.create({ data: opt });
  }
  console.log(`✅ ${boxOptionsData.length} gift box options created.`);

  // No sample orders: every order in the database must come from a real test session.
  console.log("🌸 NekiCho Vietnam database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
