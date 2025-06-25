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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middlewares/auth");
exports.userRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/* ----------- util ----------- */
const getPayload = (body) => { var _a; return (_a = body === null || body === void 0 ? void 0 : body.data) !== null && _a !== void 0 ? _a : body; };
/* ---------- REGISTER ---------- */
exports.userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName } = getPayload(req.body);
    if (!email || !password || !firstName || !lastName) {
        return res
            .status(400)
            .json({ message: "firstName, lastName, email, password requis" });
    }
    const exists = yield prisma.user.findUnique({ where: { email } });
    if (exists)
        return res.status(400).json({ message: "Email déjà utilisé" });
    const hash = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma.user.create({
        data: { email, password: hash, firstName, lastName },
    });
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.status(201).json({ token });
}));
/* ---------- LOGIN ---------- */
exports.userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = getPayload(req.body);
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        return res.status(400).json({ message: "Identifiants incorrects" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.json({ token });
}));
/* ---------- ME ---------- */
exports.userRouter.get("/me", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const me = yield prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
    });
    res.json(me);
}));
/* ---------- UPDATE ---------- */
exports.userRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = getPayload(req.body);
    const data = { firstName, lastName, email };
    if (password)
        data.password = yield bcrypt_1.default.hash(password, 10);
    const updated = yield prisma.user.update({ where: { id: req.params.id }, data });
    res.json(updated);
}));
/* ---------- ADMIN AUX ---------- */
exports.userRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.json(yield prisma.user.findMany()); }));
exports.userRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
}));
exports.userRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
}));
