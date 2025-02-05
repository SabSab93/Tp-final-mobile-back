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
exports.groupRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
exports.groupRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// POST
exports.groupRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield prisma.group.create({
        data: {
            name: req.body.data.name,
        }
    });
    res.status(201).json(groups);
}));
// GET
exports.groupRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield prisma.group.findMany();
    res.json(groups);
}));
//GET ID
exports.groupRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.id);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }
    const group = yield prisma.group.findUnique({
        where: { id: groupId },
    });
    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }
    res.json(group);
}));
//DELETE
exports.groupRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.id);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }
    const group = yield prisma.group.findUnique({
        where: { id: groupId },
    });
    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }
    yield prisma.group.delete({
        where: { id: groupId },
    });
    res.json({ message: "Group deleted" });
}));
//PUT 
exports.groupRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.id);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }
    const group = yield prisma.group.findUnique({
        where: { id: groupId },
    });
    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }
    const updatedGroup = yield prisma.group.update({
        where: { id: groupId },
        data: {
            name: req.body.data.name,
        },
    });
    res.json(updatedGroup);
}));
