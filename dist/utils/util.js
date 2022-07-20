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
exports.isPasswordMatch = exports.hashPassword = exports.ranPassword = exports.formatDate = exports.ranVerificationCode = void 0;
const date_fns_1 = require("date-fns");
const bcrypt_1 = __importDefault(require("bcrypt"));
// generate random 7 digits
const ranVerificationCode = () => {
    return Math.floor(1000000 + Math.random() * 9000000);
};
exports.ranVerificationCode = ranVerificationCode;
const formatDate = (date) => {
    return (0, date_fns_1.format)(date, "yyyy-MM-dd HH-mm-ss");
};
exports.formatDate = formatDate;
const ranPassword = () => {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 8;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
};
exports.ranPassword = ranPassword;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(13);
    const hash = yield bcrypt_1.default.hashSync(password, salt);
    return hash;
});
exports.hashPassword = hashPassword;
const isPasswordMatch = (plainTextPassword, hashPassword) => {
    return bcrypt_1.default.compareSync(plainTextPassword, hashPassword);
};
exports.isPasswordMatch = isPasswordMatch;
