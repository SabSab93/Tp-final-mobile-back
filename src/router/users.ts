import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate, AuthRequest } from "../middlewares/auth";

export const userRouter = Router();
const prisma = new PrismaClient();

/* ----------- util ----------- */
const getPayload = (body: any) => body?.data ?? body;   

/* ---------- REGISTER ---------- */
userRouter.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = getPayload(req.body);

  if (!email || !password || !firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "firstName, lastName, email, password requis" });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hash, firstName, lastName },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  res.status(201).json({ token });
});

/* ---------- LOGIN ---------- */
userRouter.post("/login", async (req, res) => {
  const { email, password } = getPayload(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Identifiants incorrects" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  res.json({ token });
});

/* ---------- ME ---------- */
userRouter.get("/me", authenticate, async (req: AuthRequest, res) => {
  const me = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
  });
  res.json(me);
});

/* ---------- UPDATE ---------- */
userRouter.put("/:id", async (req, res) => {
  const { firstName, lastName, email, password } = getPayload(req.body);

  const data: any = { firstName, lastName, email };
  if (password) data.password = await bcrypt.hash(password, 10);

  const updated = await prisma.user.update({ where: { id: req.params.id }, data });
  res.json(updated);
});

/* ---------- ADMIN AUX ---------- */
userRouter.get("/", async (_req, res) => res.json(await prisma.user.findMany()));

userRouter.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

userRouter.delete("/:id", async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: "User deleted" });
});
