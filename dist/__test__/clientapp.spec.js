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
const dotenv_1 = require("dotenv");
const server_1 = __importDefault(require("../utils/server"));
const session_1 = __importDefault(require("../utils/session"));
const client_app_1 = __importDefault(require("../routes/client-app"));
const http_status_code_1 = require("../http-status-code");
(0, dotenv_1.config)();
const PORT = parseInt(`${process.env.PORT}`) || 8001;
const isForProduction = process.env.NODE_ENV === "production" ? true : false;
const corsOptions = {
    origin: [`${process.env.FRONTEND_URL}`],
    credentials: true,
};
const FRONTEND_PWD = "Password123";
const FRONTEND_VER = "0.1";
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        config_1.default.authenticate();
        yield config_1.default.models.ClientApp.sync({ force: true });
        app = yield (0, server_1.default)();
        // cors must be placed here before session below, else fail!
        app.use((0, cors_1.default)(corsOptions));
        if (isForProduction)
            app.set("trust proxy", 1);
        app.use((0, session_1.default)({ db: config_1.default }));
        // routes - must be placed after configuring session!
        app.use("/", client_app_1.default);
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    config_1.default.close();
}));
describe("/register-client-app", () => {
    test("should return UNAUTHORIZED when no params", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/register-client-app`);
        expect(res.status).toEqual(http_status_code_1.UNAUTHORIZED);
    }));
    test("should return OK", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/register-client-app`).send({
            password: FRONTEND_PWD,
            version: FRONTEND_VER,
        });
        expect(res.status).toEqual(http_status_code_1.OK);
    }));
    test("should return FORBIDDEN", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/register-client-app`).send({
            password: FRONTEND_PWD,
            version: FRONTEND_VER,
        });
        expect(res.status).toEqual(http_status_code_1.FORBIDDEN);
    }));
});
describe("/login-client-app", () => {
    test("should return UNAUTHORIZED when no params", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/login-client-app`);
        expect(res.status).toEqual(http_status_code_1.UNAUTHORIZED);
    }));
    test("should return UNAUTHORIZED if wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/login-client-app").send({
            password: "wrongpassword",
        });
        expect(res.status).toEqual(http_status_code_1.UNAUTHORIZED);
    }));
    test("should return OK if credentials are met", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/login-client-app").send({
            password: FRONTEND_PWD,
        });
        expect(res.status).toEqual(http_status_code_1.OK);
    }));
});
