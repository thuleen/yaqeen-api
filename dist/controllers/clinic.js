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
exports.login = exports.register = void 0;
const clinic_1 = require("../services/clinic");
const http_status_code_1 = require("../http-status-code");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, postcode, email } = req.body;
    const result = yield (0, clinic_1.create)({ name, address, postcode, email });
    if (result.status === "Error") {
        res.status(http_status_code_1.OK).json(result); // status OK because we want to app to consume the message
        return;
    }
    res.status(http_status_code_1.OK).json(result);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, usrPassword } = req.body;
    const result = yield (0, clinic_1.loginUsr)({ email: email, password: usrPassword });
    if (result.status === "Error") {
        res.status(http_status_code_1.OK).json(result); // status OK because we want to app to consume the message
        return;
    }
    res.status(http_status_code_1.OK).json(result);
});
exports.login = login;
