import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./shared/middlewares/errorMiddleware";
import routes from "./infrastructure/http/routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorMiddleware);

export { app };