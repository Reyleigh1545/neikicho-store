/**
 * Runs during every build (see "build" in package.json).
 * Seeds the database ONLY when it has no products yet, so test orders
 * placed by testers are never wiped by a redeploy.
 * To reset everything on purpose, run `npm run db:seed` with DATABASE_URL set.
 */
const { PrismaClient } = require("@prisma/client");

async function run() {
  const prisma = new PrismaClient();
  let count = 0;
  try {
    count = await prisma.product.count();
  } finally {
    await prisma.$disconnect();
  }
  if (count > 0) {
    console.log(`Database already has ${count} products: skipping seed.`);
    return;
  }
  console.log("Empty database: seeding NekiCho catalog...");
  require("./seed.js");
}

run().catch((e) => {
  console.error("seed-if-empty failed:", e);
  process.exit(1);
});
