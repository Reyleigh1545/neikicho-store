/**
 * Updates a LIVE database to match catalog.js without deleting anything.
 * - categories: matched by slug (created if missing)
 * - products:   matched by slug (fields updated, created if missing)
 * - variants:   matched by sku  (fields updated, created if missing)
 * - box options matched by slug
 * Orders and order items are never touched. Runs automatically on every build.
 */
const { PrismaClient } = require("@prisma/client");
const { categoriesData, productsWithVariants, boxOptionsData } = require("./catalog");

async function syncCatalog(prisma) {
  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, imageKey: cat.imageKey, isActive: true },
      create: { ...cat, isActive: true },
    });
  }

  for (const item of productsWithVariants) {
    const { variants = [], categorySlug, ...fields } = item;
    const data = { ...fields, categoryId: categories[categorySlug].id };
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: data,
      create: data,
    });
    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: { ...v, productId: product.id, isActive: true },
        create: { ...v, productId: product.id },
      });
    }
  }

  for (const opt of boxOptionsData) {
    await prisma.giftBoxOption.upsert({
      where: { slug: opt.slug },
      update: opt,
      create: opt,
    });
  }
  console.log(
    `Catalog synced: ${categoriesData.length} categories, ${productsWithVariants.length} products, ${boxOptionsData.length} box options (orders untouched).`
  );
}

module.exports = { syncCatalog };

if (require.main === module) {
  const prisma = new PrismaClient();
  syncCatalog(prisma)
    .catch((e) => {
      console.error("sync-catalog failed:", e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
