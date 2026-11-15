/**
 * Runs during every build (see "build" in package.json).
 * - Empty database  -> full seed (seed.js).
 * - Existing data   -> sync products from catalog.js; test orders are NEVER deleted.
 * To wipe everything on purpose, run `npm run db:seed` with DATABASE_URL set.
 */
const { PrismaClient } = require("@prisma/client");
const { syncCatalog } = require("./sync-catalog");

async function run() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.product.count();
    if (count === 0) {
      console.log("Empty database: seeding NekiCho catalog...");
      await prisma.$disconnect();
      require("./seed.js");
      return;
    }
    console.log(`Database has ${count} products: syncing catalog (orders are kept)...`);
    await syncCatalog(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((e) => {
  console.error("seed-if-empty failed:", e);
  process.exit(1);
});
