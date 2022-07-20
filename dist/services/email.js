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
exports.notifyUserRegDone = void 0;
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const SMTP = process.env.SMTP;
const T_USER = process.env.TRANSPORTER_USER;
const T_PASS = process.env.TRANSPORTER_PASSWORD;
const EMAILER_EMAIL = process.env.EMAILER_EMAIL;
const hbsConfig = {
    viewEngine: {
        extName: ".hbs",
        partialsDir: path_1.default.join(__dirname, "../../email-handlebars"),
        layoutsDir: path_1.default.join(__dirname, "../../email-handlebars/"),
        defaultLayout: "",
    },
    viewPath: path_1.default.join(__dirname, "../../email-handlebars/"),
    extName: ".hbs",
};
const getTransport = () => {
    let transporter = nodemailer_1.default.createTransport({
        host: SMTP,
        pool: true,
        port: 2525,
        secure: false,
        auth: {
            user: T_USER,
            pass: T_PASS, // generated ethereal password
        },
    });
    return transporter;
};
const notifyUserRegDone = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = getTransport();
    const { email, clinicName, defaultPassword, url } = payload;
    const fs = "large";
    yield transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(hbsConfig));
    const emailContent = {
        from: EMAILER_EMAIL,
        to: email,
        cc: [],
        subject: "Yaqeen - Successfully registered",
        template: "registration-complete",
        context: { clinicName, email, defaultPassword, url, fs },
    };
    yield transporter.sendMail(emailContent).catch((error) => {
        console.log(error);
    });
});
exports.notifyUserRegDone = notifyUserRegDone;
