"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
var SequelizeStore = require("connect-session-sequelize")(express_session_1.default.Store);
const SESSION_SECRET = process.env.SESSION_SECRET || "Thuleen123$#!";
const SESSION_MAX_AGE = process.env.SESSION_MAX_AGE
    ? parseInt(process.env.SESSION_MAX_AGE)
    : 1000 * 60 * 60 * 24 * 7; // one week
const isForProduction = process.env.NODE_ENV === "production" ? true : false;
function createSession({ db }) {
    const sessionStore = new SequelizeStore({
        db: db,
        tableName: "sessions",
    });
    if (!isForProduction || process.env.DB_SYNC === "true")
        sessionStore.sync({ force: true });
    const sess = {
        secret: `${SESSION_SECRET}`,
        resave: true,
        saveUninitialized: true,
        rolling: true,
        proxy: isForProduction,
        cookie: {
            secure: isForProduction,
            maxAge: SESSION_MAX_AGE,
        },
        store: sessionStore,
    };
    return (0, express_session_1.default)(sess);
}
exports.default = createSession;
