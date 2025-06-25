import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middlewares/auth";

export const locationRouter = Router();
const prisma = new PrismaClient();

/* ----------- util ----------- */
const getPayload = (body: any) => body?.data ?? body;

/* ---------- CREATE ---------- */
/**
 * POST /api/locations
 * Body : { data: { latitude: 48.8566, longitude: 2.3522, accuracy: 9.5 } }
 */
locationRouter.post("/", authenticate, async (req: AuthRequest, res) => {
  const { latitude, longitude, accuracy } = getPayload(req.body);

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res
      .status(400)
      .json({ message: "latitude (-90/90) et longitude (-180/180) requis" });
  }

  const entry = await prisma.locationEntry.create({
    data: {
      latitude,
      longitude,
      accuracy,
      userId: req.user!.id,
    },
  });

  res.status(201).json(entry);
});

/* ---------- LIST ---------- */
/**
 * GET /api/locations
 * Renvoie l’historique de l’utilisateur connecté (ordre décroissant)
 */
locationRouter.get("/", authenticate, async (req: AuthRequest, res) => {
  const list = await prisma.locationEntry.findMany({
    where: { userId: req.user!.id },
    orderBy: { recordedAt: "desc" },
  });
  res.json(list);
});

/* ---------- DETAIL ---------- */
/**
 * GET /api/locations/:id
 */
locationRouter.get("/:id", authenticate, async (req: AuthRequest, res) => {
  const entry = await prisma.locationEntry.findUnique({
    where: { id: req.params.id },
  });

  if (!entry || entry.userId !== req.user!.id) {
    return res.status(404).json({ message: "Entrée non trouvée" });
  }
  res.json(entry);
});

/* ---------- UPDATE ---------- */
/**
 * PUT /api/locations/:id
 * Body : { data: { latitude: ..., longitude: ..., accuracy: ... } }
 */
locationRouter.put("/:id", authenticate, async (req: AuthRequest, res) => {
  const { latitude, longitude, accuracy } = getPayload(req.body);

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res
      .status(400)
      .json({ message: "latitude (-90/90) et longitude (-180/180) requis" });
  }

  const existing = await prisma.locationEntry.findUnique({
    where: { id: req.params.id },
  });
  if (!existing || existing.userId !== req.user!.id) {
    return res.status(404).json({ message: "Entrée non trouvée" });
  }

  const updated = await prisma.locationEntry.update({
    where: { id: req.params.id },
    data: { latitude, longitude, accuracy },
  });
  res.json(updated);
});

/* ---------- DELETE ---------- */
/**
 * DELETE /api/locations/:id
 */
locationRouter.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  const existing = await prisma.locationEntry.findUnique({
    where: { id: req.params.id },
  });
  if (!existing || existing.userId !== req.user!.id) {
    return res.status(404).json({ message: "Entrée non trouvée" });
  }

  await prisma.locationEntry.delete({ where: { id: req.params.id } });
  res.json({ message: "Entrée supprimée" });
});
