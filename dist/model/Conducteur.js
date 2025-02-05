"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConducteurModel = void 0;
const sequelize_1 = require("sequelize");
const ConducteurModel = (sequelize) => {
    return sequelize.define('conducteur', {
        firstName: sequelize_1.DataTypes.STRING,
        lastName: sequelize_1.DataTypes.STRING,
    });
};
exports.ConducteurModel = ConducteurModel;
