"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_app_1 = require("../controllers/client-app");
const client_app_2 = __importDefault(require("../validators/client-app"));
const client_app_3 = __importDefault(require("../middlewares/client-app"));
const router = express_1.default.Router();
router.post("/register-client-app", client_app_2.default.validate(), client_app_3.default.handleValidationError, client_app_1.register);
router.post("/login-client-app", client_app_2.default.validate(), client_app_3.default.handleValidationError, client_app_3.default.isAuthorizeForLogin, client_app_1.login);
exports.default = router;
