import express from "express";
import { registerClinic } from "../controllers/clinic";
import { default as Validator } from "../validators/clinic";
import { default as Middleware } from "../middlewares/clinic";

const router = express.Router();

router.post(
  "/register-clinic",
  Validator.validateForRegistration(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  registerClinic
);

export default router;
