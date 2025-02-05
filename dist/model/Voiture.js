"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoitureModel = void 0;
const sequelize_1 = require("sequelize");
const VoitureModel = (sequelize) => {
    return sequelize.define('voiture', {
        name: sequelize_1.DataTypes.STRING,
        immatriculation_date: sequelize_1.DataTypes.NUMBER,
    });
};
exports.VoitureModel = VoitureModel;
