import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { errorMiddleware } from "./shared/middlewares/errorMiddleware";
import routes from "./infrastructure/http/routes";
import fs from "fs";
import path from "path";

const app = express();

// Configuração única de CORS
app.use(
  cors({
    origin: ["https://dashboard-api-xkxf.onrender.com", "http://localhost:10000", "http://localhost:3333"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Detecta a URL base dinamicamente
const PORT = process.env.PORT || 3333;
const isProduction = process.env.NODE_ENV === "production";
const serverUrl = isProduction 
  ? "https://dashboard-api-xkxf.onrender.com" 
  : `http://localhost:${PORT}`;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Dashboard API",
    version: "1.0.0",
    description: "API RESTful dinâmica para dashboards",
  },
  servers: [{ url: serverUrl }],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Carrega o documento swagger do arquivo
const swaggerDocumentPath = path.join(process.cwd(), "swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerDocumentPath, "utf8"));

// Mescla com o documento estático e define o servidor correto
const finalSwaggerSpec = {
  ...swaggerSpec,
  ...swaggerDocument,
  servers: [{ url: serverUrl }],
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(finalSwaggerSpec));

app.use(routes);
app.use(errorMiddleware);

export { app };