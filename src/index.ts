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

const apiRouter = express.Router();


apiRouter.use("/auth", userRouter)
app.use("/api/batteries", batteryRouter);
app.use("/api/locations", locationRouter); 

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
