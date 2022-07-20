"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./db/config"));
const dotenv_1 = require("dotenv");
const client_app_1 = __importDefault(require("./routes/client-app"));
const clinic_1 = __importDefault(require("./routes/clinic"));
const server_1 = __importDefault(require("./utils/server"));
const session_1 = __importDefault(require("./utils/session"));
(0, dotenv_1.config)();
const PORT = parseInt(`${process.env.PORT}`) || 8001;
const isForProduction = process.env.NODE_ENV === "production" ? true : false;
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        `${process.env.FRONTEND_CLINIC_URL}`,
        `${process.env.FRONTEND_PATIENT_URL}`,
    ],
    credentials: true,
};
const app = (0, server_1.default)();
try {
    config_1.default.authenticate();
    console.log("DB connection has been established successfully.");
    // cors must be placed here before session below, else fail!
    app.use((0, cors_1.default)(corsOptions));
    if (isForProduction)
        app.set("trust proxy", 1);
    app.use((0, session_1.default)({ db: config_1.default }));
    // routes - must be placed after configuring session!
    app.use("/", client_app_1.default);
    app.use("/", clinic_1.default);
    app.listen(PORT, () => {
        console.log("Server is running    : " + PORT);
    });
}
catch (error) {
    console.error("Unable to connect to the database:", error);
}
