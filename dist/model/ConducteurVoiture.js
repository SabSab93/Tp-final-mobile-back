"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConducteurVoitureModel = void 0;
const sequelize_1 = require("sequelize");
const ConducteurVoitureModel = (sequelize) => {
    return sequelize.define('conducteurVoiture', {
        voitureId: sequelize_1.DataTypes.NUMBER,
        conducteurId: sequelize_1.DataTypes.NUMBER,
    });
};
exports.ConducteurVoitureModel = ConducteurVoitureModel;
