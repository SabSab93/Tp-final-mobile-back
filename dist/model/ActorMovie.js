"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorMovieModel = void 0;
const sequelize_1 = require("sequelize");
const ActorMovieModel = (sequelize) => {
    return sequelize.define('actorMovie', {
        actorId: sequelize_1.DataTypes.STRING,
        movieId: sequelize_1.DataTypes.STRING,
    });
};
exports.ActorMovieModel = ActorMovieModel;
