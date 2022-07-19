import express from "express";
import { register, login } from "../controllers/client-app";
import { default as Validator } from "../validators/client-app";
import { default as Middleware } from "../middlewares/client-app";

const router = express.Router();

router.post(
  "/register-client-app",
  Validator.validate(),
  Middleware.handleValidationError,
  register
);

router.post(
  "/login-client-app",
  Validator.validate(),
  Middleware.handleValidationError,
  Middleware.isAuthorizeForLogin,
  login
);

export default router;
