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
    const nuClinic = yield models_1.Clinic.create({
        name: name,
        address: address,
        postcode: postcode,
    });
    const defaultPassword = (0, utils_1.ranPassword)();
    const hashedPassword = yield (0, utils_1.hashPassword)(defaultPassword);
    // const nuUser = await User.create({
    //   name: "", // For now empty
    //   email: email,
    //   password: hashedPassword,
    //   ClinicId: nuClinic.id,,,
    // });
    let nuUser = yield nuClinic.createUser();
    nuUser.password = hashedPassword;
    nuUser.email = email;
    yield nuUser.save();
    yield (0, email_1.notifyUserRegDone)({
        email: email,
        clinicName: name,
        defaultPassword: defaultPassword,
        url: FRONTEND_CLINIC_URL,
    });
    if (process.env.NODE_ENV === "test") {
        return {
            status: "OK",
            message: `Successfully registered. Email is sent to ${email}`,
            result: { clinic: nuClinic, usrPassword: defaultPassword },
        };
    }
    return {
        status: "OK",
        message: `Successfully registered. Email is sent to ${email}`,
        result: { clinic: nuClinic },
    };
});
exports.create = create;
const loginUsr = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield models_1.User.findOne({
        where: {
            email: email,
        },
    });
    if (!user) {
        return {
            status: "Error",
            message: `Could not find user with the email`,
        };
    }
    const hashedPassword = user.password;
    if (!(0, utils_1.isPasswordMatch)(password, hashedPassword)) {
        return {
            status: "Error",
            message: `Incorrect password`,
        };
    }
    const clinic = yield models_1.Clinic.findOne({
        where: { id: user.ClinicId },
    });
    return {
        status: "OK",
        message: `Successfully logged in`,
        result: { clinic },
    };
});
exports.loginUsr = loginUsr;
