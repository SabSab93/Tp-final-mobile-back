"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EleveModel = void 0;
const sequelize_1 = require("sequelize");
const EleveModel = (sequelize) => {
    return sequelize.define('eleve', {
        lastname: sequelize_1.DataTypes.STRING,
        firstname: sequelize_1.DataTypes.STRING,
    });
};
exports.EleveModel = EleveModel;
