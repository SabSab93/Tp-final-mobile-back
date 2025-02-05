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
exports.movieRouter = void 0;
const express_1 = require("express");
const __1 = require("..");
exports.movieRouter = (0, express_1.Router)();
exports.movieRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movies = yield __1.Movie.create({
        title: req.body.data.title,
        description: req.body.data.description,
        movies_date: req.body.data.movies_date
    });
    res.status(201).json(movies);
}));
exports.movieRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movies = yield __1.Movie.findAll();
    res.json(movies);
}));
exports.movieRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield __1.Movie.findByPk(parseInt(req.params.id));
    if (!movie) {
        res.status(404).json({ message: "Movie not found" });
        return;
    }
    else {
        res.json(movie);
    }
}));
exports.movieRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myMovie = yield __1.Movie.findByPk(parseInt(req.params.id));
    if (!myMovie) {
        res.status(404).json({ message: "Movie not found" });
        return;
    }
    else {
        yield myMovie.destroy();
        res.json({ message: "Movie deleted" });
    }
}));
exports.movieRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myMovie = yield __1.Movie.findByPk(parseInt(req.params.id));
    if (!myMovie) {
        res.status(404).json({ message: "Movie not found" });
        return;
    }
    else {
        myMovie.title = req.body.data.title;
        myMovie.description = req.body.data.description;
        myMovie.movies_date = req.body.data.movies_date;
        yield myMovie.save();
        res.json(myMovie);
    }
}));
exports.movieRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield __1.Movie.findByPk(parseInt(req.params.id));
    if (!movie) {
        res.status(404).json({ message: "Movie not found" });
        return;
    }
    else {
        res.json(movie);
    }
}));
