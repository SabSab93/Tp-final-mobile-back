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
exports.movieEleve = void 0;
const express_1 = require("express");
const __1 = require("..");
exports.movieEleve = (0, express_1.Router)();
exports.movieEleve.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eleves = yield __1.Eleve.create({
        lastname: req.body.data.lastname,
        firstname: req.body.data.firstname
    });
    res.status(201).json(eleves);
}));
exports.movieEleve.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eleves = yield __1.Eleve.findAll();
    res.json(eleves);
}));
exports.movieEleve.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eleve = yield __1.Eleve.findByPk(parseInt(req.params.id));
    if (!eleve) {
        res.status(404).json({ message: "Eleve not found" });
        return;
    }
    else {
        res.json(eleve);
    }
}));
exports.movieEleve.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eleve = yield __1.Eleve.findByPk(parseInt(req.params.id));
    if (!eleve) {
        res.status(404).json({ message: "Eleve not found" });
        return;
    }
    else {
        yield eleve.destroy();
        res.json({ message: "Eleve deleted" });
    }
}));
exports.movieEleve.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eleve = yield __1.Eleve.findByPk(parseInt(req.params.id));
    if (!eleve) {
        res.status(404).json({ message: "Eleve not found" });
        return;
    }
    else {
        eleve.lastname = req.body.data.lastname;
        eleve.firstname = req.body.data.firstname;
        yield eleve.save();
        res.json(eleve);
    }
}));
exports.movieEleve.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eleve = yield __1.Eleve.findByPk(parseInt(req.params.id));
    if (!eleve) {
        res.status(404).json({ message: "Eleve not found" });
        return;
    }
    else {
        res.json(eleve);
    }
}));
