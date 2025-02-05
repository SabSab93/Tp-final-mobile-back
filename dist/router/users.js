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
exports.userRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
exports.userRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// POST
exports.userRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.create({
        data: {
            firstname: req.body.data.firstname,
            lastname: req.body.data.lastname,
            email: req.body.data.firstname + "." + req.body.data.lastname + "@gmail.com",
            mtp: req.body.data.mtp
        }
    });
    res.status(201).json(users);
}));
// GET
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    res.json(users);
}));
//GET ID
exports.userRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
}));
//DELETE
exports.userRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    yield prisma.user.delete({
        where: { id: userId },
    });
    res.json({ message: "User deleted" });
}));
//PUT 
exports.userRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = yield prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = yield prisma.user.update({
        where: { id: userId },
        data: {
            lastname: req.body.data.lastname,
            firstname: req.body.data.firstname,
            email: req.body.data.email,
            mtp: req.body.data.mtp
        },
    });
    res.json(updatedUser);
}));
