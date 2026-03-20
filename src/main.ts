import 'dotenv/config';
import { app } from "./server";
import { prisma } from "./infrastructure/database/prisma"; 

const PORT = process.env.PORT || 3333;

async function bootstrap() {
  try {
    // Testa a conexão com o banco
    await prisma.$connect();
    console.log('🐘 Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🔥 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);

    try {
      await prisma.$disconnect();
      console.log('🔌 Database pool disconnected gracefully');
    } catch (disconnectErr) {
      console.error('❌ Error during database disconnect', disconnectErr);
    }

    console.error('⏳ Tentando reconectar em 5 segundos...');
    setTimeout(bootstrap, 5000);
  }
}

bootstrap();