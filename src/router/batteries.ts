import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middlewares/auth";

export const batteryRouter = Router();
const prisma = new PrismaClient();

/* ----------- util ----------- */
const getPayload = (body: any) => body?.data ?? body;

/* ---------- CREATE ---------- */
/**
 * POST /api/batteries
 * Body: { data: { level: 87 } }
 */
batteryRouter.post("/", authenticate, async (req: AuthRequest, res) => {
  const { level } = getPayload(req.body);

  if (typeof level !== "number" || level < 0 || level > 100) {
    return res.status(400).json({ message: "level doit être entre 0 et 100" });
  }

  const entry = await prisma.batteryEntry.create({
    data: {
      level,
      userId: req.user!.id,
    },
  });

  res.status(201).json(entry);
});

/* ---------- LIST ---------- */
/**
 * GET /api/batteries
 * Retourne l'historique de l'utilisateur connecté (ordre décroissant)
 */
batteryRouter.get("/", authenticate, async (req: AuthRequest, res) => {
  const list = await prisma.batteryEntry.findMany({
    where: { userId: req.user!.id },
    orderBy: { recordedAt: "desc" },
  });
  res.json(list);
});

/* ---------- DETAIL ---------- */
/**
 * GET /api/batteries/:id
 */
batteryRouter.get("/:id", authenticate, async (req: AuthRequest, res) => {
  const entry = await prisma.batteryEntry.findUnique({
    where: { id: req.params.id },
  });

  if (!entry || entry.userId !== req.user!.id) {
    return res.status(404).json({ message: "Entrée non trouvée" });
  }
  res.json(entry);
});

/* ---------- UPDATE ---------- */
/**
 * PUT /api/batteries/:id
 * Body: { data: { level: 55 } }
 */
batteryRouter.put("/:id", authenticate, async (req: AuthRequest, res) => {
  const { level } = getPayload(req.body);

  if (typeof level !== "number" || level < 0 || level > 100) {
    return res.status(400).json({ message: "level doit être entre 0 et 100" });
  }

  // Vérifie la propriété
  const existing = await prisma.batteryEntry.findUnique({
    where: { id: req.params.id },
  });
  if (!existing || existing.userId !== req.user!.id) {
    return res.status(404).json({ message: "Entrée non trouvée" });
  }

  const updated = await prisma.batteryEntry.update({
    where: { id: req.params.id },
    data: { level },
  });
  res.json(updated);
});

/* ---------- DELETE ---------- */
/**
 * DELETE /api/batteries/:id
 */
batteryRouter.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  const existing = await prisma.batteryEntry.findUnique({
    where: { id: req.params.id },
  });
  if (!existing || existing.userId !== req.user!.id) {
    return res.status(404).json({ message: "Entrée non trouvée" });
  }

  await prisma.batteryEntry.delete({ where: { id: req.params.id } });
  res.json({ message: "Entrée supprimée" });
});
