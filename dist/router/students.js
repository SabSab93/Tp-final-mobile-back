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
exports.studentRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
exports.studentRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// POST
exports.studentRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield prisma.student.create({
        data: {
            firstname: req.body.data.firstname,
            lastname: req.body.data.lastname,
            age: req.body.data.age,
            classRoomId: req.body.data.classRoomId
        }
    });
    res.status(201).json(students);
}));
// GET
exports.studentRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield prisma.student.findMany();
    res.json(students);
}));
//GET ID
exports.studentRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = parseInt(req.params.id);
    if (isNaN(studentId)) {
        return res.status(400).json({ message: "Invalid student ID" });
    }
    const student = yield prisma.student.findUnique({
        where: { id: studentId },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
}));
//DELETE
exports.studentRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = parseInt(req.params.id);
    if (isNaN(studentId)) {
        return res.status(400).json({ message: "Invalid student ID" });
    }
    const student = yield prisma.student.findUnique({
        where: { id: studentId },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    yield prisma.student.delete({
        where: { id: studentId },
    });
    res.json({ message: "Student deleted" });
}));
//PUT 
exports.studentRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = parseInt(req.params.id);
    if (isNaN(studentId)) {
        return res.status(400).json({ message: "Invalid student ID" });
    }
    const student = yield prisma.student.findUnique({
        where: { id: studentId },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    const updatedStudent = yield prisma.student.update({
        where: { id: studentId },
        data: {
            lastname: req.body.data.lastname,
            firstname: req.body.data.firstname,
            age: req.body.data.age,
            classRoomId: req.body.data.classRoomId
        },
    });
    res.json(updatedStudent);
}));
