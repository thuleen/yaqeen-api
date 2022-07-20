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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUsr = exports.create = void 0;
const models_1 = require("../models/");
const utils_1 = require("../utils");
const email_1 = require("./email");
const FRONTEND_CLINIC_URL = `${process.env.FRONTEND_CLINIC_URL} `;
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, postcode, email } = payload;
    const userRecord = yield models_1.User.findOne({
        where: { email: email },
    });
    if (userRecord) {
        return {
            status: "Error",
            message: "Could not register because email is not unique",
        };
    }
    const defaultPassword = (0, utils_1.ranPassword)();
    const hashedPassword = yield (0, utils_1.hashPassword)(defaultPassword);
    const nuUser = yield models_1.User.create({
        name: "",
        email: email,
        password: hashedPassword,
    });
    const nuClinic = yield models_1.Clinic.create({
        name: name,
        address: address,
        postcode: postcode,
    });
    yield (0, email_1.notifyUserRegDone)({
        email: email,
        clinicName: name,
        defaultPassword: defaultPassword,
        url: FRONTEND_CLINIC_URL,
    });
    return {
        status: "OK",
        message: `Successfully registered. Email is sent to ${email}`,
        result: { clinic: nuClinic },
    };
});
exports.create = create;
const loginUsr = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    return {
        status: "OK",
        message: `Successfully logged in`,
    };
});
exports.loginUsr = loginUsr;
