import { prisma } from "../src/infrastructure/database/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  const categories = ["Software", "Hardware", "Services", "Support"];
  const statuses = ["completed", "pending", "cancelled"];

  for (let i = 0; i < 50; i++) {
    await prisma.transaction.create({
      data: {
        category: categories[Math.floor(Math.random() * categories.length)],
        amount: Math.random() * 5000 + 100,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28),
        ),
      },
    });
  }

  console.log("✅ Seed finished!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
