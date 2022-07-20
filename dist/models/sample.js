"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../db/config"));
class Sample extends sequelize_1.Model {
}
Sample.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    testType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    tagNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    patientName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    patientIdType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    patientSocId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    samplePhotoDataUri: {
        type: sequelize_1.DataTypes.BLOB("long"),
        allowNull: true,
    },
    pending: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    lastActiveStep: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    interpretAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    photoTakenAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "samples",
    sequelize: config_1.default,
    paranoid: true,
});
exports.default = Sample;
