"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sample_1 = require("../controllers/sample");
// import { default as Validator } from "../validators/sample";
// import { default as Middleware } from "../middlewares/sample";
const router = express_1.default.Router();
router.post("/create-sample", 
// Validator.validate(),
// Middleware.handleValidationError,
// Middleware.isAuthorizeForLogin,
sample_1.create);
exports.default = router;
