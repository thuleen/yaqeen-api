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
const supertest_1 = __importDefault(require("supertest"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("../db/config"));
const models_1 = require("../models");
const dotenv_1 = require("dotenv");
const server_1 = __importDefault(require("../utils/server"));
const session_1 = __importDefault(require("../utils/session"));
const client_app_1 = __importDefault(require("../routes/client-app"));
const clinic_1 = __importDefault(require("../routes/clinic"));
const http_status_code_1 = require("../http-status-code");
const utils_1 = require("../utils");
(0, dotenv_1.config)();
const PORT = parseInt(`${process.env.PORT}`) || 8001;
const isForProduction = process.env.NODE_ENV === "production" ? true : false;
const corsOptions = {
    origin: [`${process.env.FRONTEND_URL}`],
    credentials: true,
};
const FRONTEND_PWD = "Password123";
const FRONTEND_VER = "0.1";
const USER_EMAIL_1 = "test_duplication@email.com";
const USER_PWD_1 = "Tipahtertipu123!";
const clinicName = "Klinik A";
const clinicAddr = "No 123, Jalan Kesihatan, Taman Surian";
const clinicPostcode = "89001";
const email = "tipahtertipu@clinicmedivron.com.my";
let usrPassword = "";
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        config_1.default.authenticate();
        yield config_1.default.query("SET FOREIGN_KEY_CHECKS = 0"); // only for test!
        yield models_1.ClientApp.sync({ force: true });
        yield models_1.Clinic.sync({ force: true });
        yield models_1.User.sync({ force: true });
        // Create dummy records
        let hashedPassword = yield (0, utils_1.hashPassword)(FRONTEND_PWD);
        yield models_1.ClientApp.create({
            password: hashedPassword,
            version: FRONTEND_VER,
        });
        hashedPassword = yield (0, utils_1.hashPassword)(USER_PWD_1);
        yield models_1.User.create({
            email: USER_EMAIL_1,
            password: hashedPassword,
        });
        app = yield (0, server_1.default)();
        // cors must be placed here before session below, else fail!
        app.use((0, cors_1.default)(corsOptions));
        if (isForProduction)
            app.set("trust proxy", 1);
        app.use((0, session_1.default)({ db: config_1.default }));
        // routes - must be placed after configuring session!
        app.use("/", client_app_1.default);
        app.use("/", clinic_1.default);
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    config_1.default.close();
}));
describe("/register-clinic", () => {
    test("should return UNAUTHORIZED when no params", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/register-clinic`);
        expect(res.status).toEqual(http_status_code_1.UNAUTHORIZED);
    }));
    test("should return 400 when client app password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/register-clinic`).send({
            password: "WronngPassword",
            name: clinicName,
            address: clinicAddr,
            postcode: clinicPostcode,
            email: email,
        });
        expect(res.status).toEqual(http_status_code_1.UNAUTHORIZED);
    }));
    test("should return UNAUTHORIZED when user have same email ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/register-clinic`).send({
            password: FRONTEND_PWD,
            name: clinicName,
            address: clinicAddr,
            postcode: clinicPostcode,
            email: USER_EMAIL_1, // duplicates!
        });
        expect(res.status).toEqual(http_status_code_1.OK); // OK because we want frontend to consume the message
        expect(res.body.message).toEqual("Could not register because email is not unique");
    }));
    test("should return OK when ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/register-clinic`).send({
            password: FRONTEND_PWD,
            name: clinicName,
            address: clinicAddr,
            postcode: clinicPostcode,
            email: email,
        });
        // console.log(res.body.result);
        expect(res.status).toEqual(http_status_code_1.OK);
        expect(res.body.message).toEqual(`Successfully registered. Email is sent to ${email}`);
        expect(res.body.result.clinic.name).toEqual(clinicName);
        expect(res.body.result.clinic.address).toEqual(clinicAddr);
        usrPassword = res.body.result.usrPassword;
    }));
});
describe("/login-clinic-user", () => {
    test("return UNAUTHORIZED when no params", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/login-clinic-user`);
        expect(res.status).toEqual(http_status_code_1.UNAUTHORIZED);
    }));
    test("return could not find user with dubious email", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/login-clinic-user`).send({
            password: FRONTEND_PWD,
            email: "dubious@email.com",
            usrPassword: usrPassword,
        });
        expect(res.status).toEqual(http_status_code_1.OK);
        expect(res.body.message).toEqual("Could not find user with the email");
    }));
    test("return incorrect password", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/login-clinic-user`).send({
            password: FRONTEND_PWD,
            email: email,
            usrPassword: "wronguserpassword",
        });
        expect(res.status).toEqual(http_status_code_1.OK);
        expect(res.body.message).toEqual("Incorrect password");
    }));
    test("return OK", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/login-clinic-user`).send({
            password: FRONTEND_PWD,
            email: email,
            usrPassword: usrPassword,
        });
        expect(res.status).toEqual(http_status_code_1.OK);
        expect(res.body.message).toEqual("Successfully logged in");
        expect(res.body.result.clinic.id).toBeGreaterThan(0);
        expect(res.body.result.clinic.name).toEqual(clinicName);
        expect(res.body.result.clinic.address).toEqual(clinicAddr);
        expect(res.body.result.clinic.postcode).toEqual(clinicPostcode);
    }));
});
