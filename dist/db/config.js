"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const dbName = process.env.NODE_ENV === "test" ? "yaqeen_test" : `${process.env.DB_NAME}`;
const dbUser = process.env.NODE_ENV === "test" ? "yaqeen" : `${process.env.DB_USER}`;
const dbHost = process.env.NODE_ENV === "test" ? "localhost" : `${process.env.DB_HOST}`;
const dbPassword = process.env.NODE_ENV === "test" ? "Yaqeen123!" : `${process.env.DB_PASSWORD}`;
const isForProduction = process.env.NODE_ENV === "production" ? true : false;
const dbPort = 3306;
const db = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    dialectOptions: {
        socketPath: !isForProduction ? "/tmp/mysql.sock" : "",
    },
    logging: false,
});
if (process.env.DB_SYNC === "true" && process.env.NODE_ENV !== "test") {
    db.sync({ force: true });
}
exports.default = db;
