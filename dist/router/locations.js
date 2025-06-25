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
exports.locationRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middlewares/auth");
exports.locationRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/* ----------- util ----------- */
const getPayload = (body) => { var _a; return (_a = body === null || body === void 0 ? void 0 : body.data) !== null && _a !== void 0 ? _a : body; };
/* ---------- CREATE ---------- */
/**
 * POST /api/locations
 * Body : { data: { latitude: 48.8566, longitude: 2.3522, accuracy: 9.5 } }
 */
exports.locationRouter.post("/", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { latitude, longitude, accuracy } = getPayload(req.body);
    if (typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180) {
        return res
            .status(400)
            .json({ message: "latitude (-90/90) et longitude (-180/180) requis" });
    }
    const entry = yield prisma.locationEntry.create({
        data: {
            latitude,
            longitude,
            accuracy,
            userId: req.user.id,
        },
    });
    res.status(201).json(entry);
}));
/* ---------- LIST ---------- */
/**
 * GET /api/locations
 * Renvoie l’historique de l’utilisateur connecté (ordre décroissant)
 */
exports.locationRouter.get("/", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield prisma.locationEntry.findMany({
        where: { userId: req.user.id },
        orderBy: { recordedAt: "desc" },
    });
    res.json(list);
}));
/* ---------- DETAIL ---------- */
/**
 * GET /api/locations/:id
 */
exports.locationRouter.get("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield prisma.locationEntry.findUnique({
        where: { id: req.params.id },
    });
    if (!entry || entry.userId !== req.user.id) {
        return res.status(404).json({ message: "Entrée non trouvée" });
    }
    res.json(entry);
}));
/* ---------- UPDATE ---------- */
/**
 * PUT /api/locations/:id
 * Body : { data: { latitude: ..., longitude: ..., accuracy: ... } }
 */
exports.locationRouter.put("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { latitude, longitude, accuracy } = getPayload(req.body);
    if (typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180) {
        return res
            .status(400)
            .json({ message: "latitude (-90/90) et longitude (-180/180) requis" });
    }
    const existing = yield prisma.locationEntry.findUnique({
        where: { id: req.params.id },
    });
    if (!existing || existing.userId !== req.user.id) {
        return res.status(404).json({ message: "Entrée non trouvée" });
    }
    const updated = yield prisma.locationEntry.update({
        where: { id: req.params.id },
        data: { latitude, longitude, accuracy },
    });
    res.json(updated);
}));
/* ---------- DELETE ---------- */
/**
 * DELETE /api/locations/:id
 */
exports.locationRouter.delete("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma.locationEntry.findUnique({
        where: { id: req.params.id },
    });
    if (!existing || existing.userId !== req.user.id) {
        return res.status(404).json({ message: "Entrée non trouvée" });
    }
    yield prisma.locationEntry.delete({ where: { id: req.params.id } });
    res.json({ message: "Entrée supprimée" });
}));
