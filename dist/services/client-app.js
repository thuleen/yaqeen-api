"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.create = exports.verifyPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models/");
const utils_1 = require("../utils");
const FRONTEND_PWD = process.env.FRONTEND_PWD || "Thuleen123#";
const verifyPassword = (password1, password2) => {
    return bcrypt_1.default.compareSync(password1, password2);
};
exports.verifyPassword = verifyPassword;
// call to register an app
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, version } = payload;
    const client = yield models_1.ClientApp.findOne({ where: { id: 1 } });
    if (client) {
        return {
            status: "Error",
            message: "A client app already exist",
        };
    }
    const hashedPassword = yield (0, utils_1.hashPassword)(password);
    const newapp = yield models_1.ClientApp.create({
        password: hashedPassword,
        version: version,
    });
    return {
        status: "OK",
        message: "A client app is successfully created",
        result: newapp,
    };
});
exports.create = create;
const login = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield models_1.ClientApp.findOne({
        where: { id: 1 },
    });
    if (!client) {
        return {
            status: "Error",
            message: "Could not logged in because no such record for the client app",
        };
    }
    if (!verifyPassword(password, client.password)) {
        return {
            status: "Error",
            message: "Could not logged in because wrong password",
        };
    }
    return { status: "OK", message: "Successfully logged in" };
});
exports.login = login;
