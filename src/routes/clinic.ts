import express from "express";
import { register, login } from "../controllers/clinic";
import { default as Validator } from "../validators/clinic";
import { default as Middleware } from "../middlewares/clinic";

const router = express.Router();

router.post(
  "/register-clinic",
  Validator.validateForRegistration(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  register
);

router.post(
  "/login-clinic-user",
  Validator.validateForLogin(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  login
);

export default router;
