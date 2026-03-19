import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./shared/middlewares/errorMiddleware";

const app = express();
app.use(cors());
app.use(express.json());

// Aqui entrarão as rotas depois
// app.use(routes);

app.use(errorMiddleware);

export { app };