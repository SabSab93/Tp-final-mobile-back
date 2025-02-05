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
exports.classRoomRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
exports.classRoomRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// POST
exports.classRoomRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classRooms = yield prisma.classRoom.create({
        data: {
            name: req.body.data.name
        }
    });
    res.status(201).json(classRooms);
}));
// GET
exports.classRoomRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classRooms = yield prisma.classRoom.findMany();
    res.json(classRooms);
}));
//GET ID
exports.classRoomRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classRoomId = parseInt(req.params.id);
    if (isNaN(classRoomId)) {
        return res.status(400).json({ message: "Invalid classRoom ID" });
    }
    const classRoom = yield prisma.classRoom.findUnique({
        where: { id: classRoomId },
    });
    if (!classRoom) {
        return res.status(404).json({ message: "ClassRoom not found" });
    }
    res.json(classRoom);
}));
//DELETE
exports.classRoomRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classRoomId = parseInt(req.params.id);
    if (isNaN(classRoomId)) {
        return res.status(400).json({ message: "Invalid classRoom ID" });
    }
    const classRoom = yield prisma.classRoom.findUnique({
        where: { id: classRoomId },
    });
    if (!classRoom) {
        return res.status(404).json({ message: "ClassRoom not found" });
    }
    yield prisma.classRoom.delete({
        where: { id: classRoomId },
    });
    res.json({ message: "ClassRoom deleted" });
}));
//PUT 
exports.classRoomRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classRoomId = parseInt(req.params.id);
    if (isNaN(classRoomId)) {
        return res.status(400).json({ message: "Invalid classRoom ID" });
    }
    const classRoom = yield prisma.classRoom.findUnique({
        where: { id: classRoomId },
    });
    if (!classRoom) {
        return res.status(404).json({ message: "ClassRoom not found" });
    }
    const updatedClassRoomId = yield prisma.classRoom.update({
        where: { id: classRoomId },
        data: {
            name: req.body.data.name
        },
    });
    res.json(updatedClassRoomId);
}));
