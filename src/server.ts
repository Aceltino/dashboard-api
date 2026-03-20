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

const swaggerOptions = {
  swaggerDefinition,
  apis: [
    "src/infrastructure/http/routes/*.ts",
    "src/infrastructure/http/controllers/*.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

app.use(errorMiddleware);

export { app };
