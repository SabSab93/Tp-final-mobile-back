"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorModel = void 0;
const sequelize_1 = require("sequelize");
const ActorModel = (sequelize) => {
    return sequelize.define('actor', {
        lastname: sequelize_1.DataTypes.STRING,
        firstname: sequelize_1.DataTypes.STRING,
    });
};
exports.ActorModel = ActorModel;
