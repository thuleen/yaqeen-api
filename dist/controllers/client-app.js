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
exports.refreshSession = exports.login = exports.register = void 0;
const http_status_code_1 = require("../http-status-code");
const client_app_1 = require("../services/client-app");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, version } = req.body;
    const r = yield (0, client_app_1.create)({ password, version });
    if (r.status === "Error") {
        res.status(http_status_code_1.FORBIDDEN).json(r);
        return;
    }
    res.status(http_status_code_1.OK).json(r);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.isAuth = true;
    res.status(http_status_code_1.OK).json({ message: "Logged in" });
});
exports.login = login;
const refreshSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.body;
    req.session.touch();
    req.session.isAuth = true;
    res
        .status(http_status_code_1.OK)
        .json({ status: "OK", message: "Successfully refreshed session" });
});
exports.refreshSession = refreshSession;
