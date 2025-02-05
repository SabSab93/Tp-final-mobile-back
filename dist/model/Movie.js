"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieModel = void 0;
const sequelize_1 = require("sequelize");
const MovieModel = (sequelize) => {
    return sequelize.define('movie', {
        title: sequelize_1.DataTypes.STRING,
        description: sequelize_1.DataTypes.STRING,
        movies_date: sequelize_1.DataTypes.NUMBER,
    });
};
exports.MovieModel = MovieModel;
