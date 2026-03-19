import 'dotenv/config';
import { app } from "./server";
import { prisma } from "./infrastructure/database/prisma"; 

const PORT = process.env.PORT || 3333;

async function bootstrap() {
  try {
    // 1. Testa a conexão com o banco no Docker
    await prisma.$connect();
    console.log("🐘 Database connected successfully");

    // 2. Inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`🔥 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    // Fecha a conexão com o prisma antes de sair, se necessário
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();