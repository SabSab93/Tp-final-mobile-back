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
exports.actorRouter = void 0;
const express_1 = require("express");
const __1 = require("..");
exports.actorRouter = (0, express_1.Router)();
exports.actorRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const actor = yield __1.Actor.create({
        lastname: req.body.data.lastname,
        firstname: req.body.data.firstname
    });
    res.status(201).json(actor);
}));
exports.actorRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const actor = yield __1.Actor.findAll();
    res.json(actor);
}));
exports.actorRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const actor = yield __1.Actor.findByPk(parseInt(req.params.id));
    if (!actor) {
        res.status(404).json({ message: "Actor not found" });
        return;
    }
    else {
        res.json(actor);
    }
}));
exports.actorRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const actor = yield __1.Actor.findByPk(parseInt(req.params.id));
    if (!actor) {
        res.status(404).json({ message: "Actor not found" });
        return;
    }
    else {
        yield actor.destroy();
        res.json({ message: "Actor deleted" });
    }
}));
exports.actorRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myActor = yield __1.Actor.findByPk(parseInt(req.params.id));
    if (!myActor) {
        res.status(404).json({ message: "Actor not found" });
        return;
    }
    else {
        myActor.lastname = req.body.data.lastname;
        myActor.firstname = req.body.data.firstname;
        yield myActor.save();
        res.json(myActor);
    }
}));
