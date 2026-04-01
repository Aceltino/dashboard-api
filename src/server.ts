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

// Config CORS
app.use(
  cors({
    origin: [
      "https://dashboard-api-xkxf.onrender.com",
      "http://localhost:10000",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://localhost:3333",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"], // Adicionei 'Accept' que é boa prática
  }),
);

app.use(express.json());

const PORT = process.env.PORT || 3333;
const isProduction = process.env.NODE_ENV === "production";
const serverUrl = isProduction
  ? "https://dashboard-api-xkxf.onrender.com"
  : `http://localhost:${PORT}`;
const swaggerServer = "/"; // always use the current host for API docs

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

// load the swagger document from the file
const swaggerDocumentPath = path.join(process.cwd(), "swagger.json");
const swaggerDocument = JSON.parse(
  fs.readFileSync(swaggerDocumentPath, "utf8"),
);

// Merge with the static document and define the correct server
const finalSwaggerSpec = {
  ...swaggerSpec,
  ...swaggerDocument,
  servers: [{ url: swaggerServer }],
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(finalSwaggerSpec));

app.use(routes);
app.use(errorMiddleware);

export { app };
