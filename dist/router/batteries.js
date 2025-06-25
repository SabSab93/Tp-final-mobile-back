"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batteryRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middlewares/auth");
exports.batteryRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/* ----------- util ----------- */
const getPayload = (body) => { var _a; return (_a = body === null || body === void 0 ? void 0 : body.data) !== null && _a !== void 0 ? _a : body; };
/* ---------- CREATE ---------- */
/**
 * POST /api/batteries
 * Body: { data: { level: 87 } }
 */
exports.batteryRouter.post("/", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { level } = getPayload(req.body);
    if (typeof level !== "number" || level < 0 || level > 100) {
        return res.status(400).json({ message: "level doit être entre 0 et 100" });
    }
    const entry = yield prisma.batteryEntry.create({
        data: {
            level,
            userId: req.user.id,
        },
    });
    res.status(201).json(entry);
}));
/* ---------- LIST ---------- */
/**
 * GET /api/batteries
 * Retourne l'historique de l'utilisateur connecté (ordre décroissant)
 */
exports.batteryRouter.get("/", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield prisma.batteryEntry.findMany({
        where: { userId: req.user.id },
        orderBy: { recordedAt: "desc" },
    });
    res.json(list);
}));
/* ---------- DETAIL ---------- */
/**
 * GET /api/batteries/:id
 */
exports.batteryRouter.get("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield prisma.batteryEntry.findUnique({
        where: { id: req.params.id },
    });
    if (!entry || entry.userId !== req.user.id) {
        return res.status(404).json({ message: "Entrée non trouvée" });
    }
    res.json(entry);
}));
/* ---------- UPDATE ---------- */
/**
 * PUT /api/batteries/:id
 * Body: { data: { level: 55 } }
 */
exports.batteryRouter.put("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { level } = getPayload(req.body);
    if (typeof level !== "number" || level < 0 || level > 100) {
        return res.status(400).json({ message: "level doit être entre 0 et 100" });
    }
    // Vérifie la propriété
    const existing = yield prisma.batteryEntry.findUnique({
        where: { id: req.params.id },
    });
    if (!existing || existing.userId !== req.user.id) {
        return res.status(404).json({ message: "Entrée non trouvée" });
    }
    const updated = yield prisma.batteryEntry.update({
        where: { id: req.params.id },
        data: { level },
    });
    res.json(updated);
}));
/* ---------- DELETE ---------- */
/**
 * DELETE /api/batteries/:id
 */
exports.batteryRouter.delete("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma.batteryEntry.findUnique({
        where: { id: req.params.id },
    });
    if (!existing || existing.userId !== req.user.id) {
        return res.status(404).json({ message: "Entrée non trouvée" });
    }
    yield prisma.batteryEntry.delete({ where: { id: req.params.id } });
    res.json({ message: "Entrée supprimée" });
}));
