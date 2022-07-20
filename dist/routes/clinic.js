"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clinic_1 = require("../controllers/clinic");
const clinic_2 = __importDefault(require("../validators/clinic"));
const clinic_3 = __importDefault(require("../middlewares/clinic"));
const router = express_1.default.Router();
router.post("/register-clinic", clinic_2.default.validateForRegistration(), clinic_3.default.handleValidationError, clinic_3.default.isAuthorize, clinic_1.register);
router.post("/login-clinic-user", clinic_2.default.validateForLogin(), clinic_3.default.handleValidationError, clinic_3.default.isAuthorize, clinic_1.login);
exports.default = router;
