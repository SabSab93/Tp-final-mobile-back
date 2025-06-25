import cors from "cors";
import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";

import { userRouter } from "./router/users";
import { batteryRouter } from "./router/batteries";
import { locationRouter } from "./router/locations";

export const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck & root
app.get("/healthcheck", (_req, res) => res.status(200).send("OK"));
app.get("/", (_req, res) => res.status(200).send("API is running"));

// Toutes les routes d'API seront sous /api
const apiRouter = express.Router();

// Auth
apiRouter.use("/auth", userRouter);

// Batteries
apiRouter.use("/batteries", batteryRouter);

// Locations
apiRouter.use("/locations", locationRouter);

// Monte apiRouter
app.use("/api", apiRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
