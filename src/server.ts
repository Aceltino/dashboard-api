import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { errorMiddleware } from "./shared/middlewares/errorMiddleware";
import routes from "./infrastructure/http/routes";

const app = express();
app.use(cors());
app.use(express.json());

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Dashboard API",
    version: "1.0.0",
    description: "API RESTful dinâmica para dashboards",
  },
  servers: [{ url: "http://localhost:" + (process.env.PORT || 3333) }],
};

import fs from "fs";
import path from "path";

const swaggerOptions = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Load swagger document from file
const swaggerDocumentPath = path.join(process.cwd(), "swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerDocumentPath, "utf8"));

// Merge with the static swagger document
const finalSwaggerSpec = {
  ...swaggerSpec,
  ...swaggerDocument,
  servers: [{ url: "http://localhost:" + (process.env.PORT || 3333) }],
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(finalSwaggerSpec));

app.use(routes);

app.use(errorMiddleware);

export { app };
