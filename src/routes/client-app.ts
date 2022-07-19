import express from "express";
import { loginApp } from "../controllers/client-app";
import { default as Validator } from "../validators/client-app";
import { default as Middleware } from "../middlewares/client-app";

const router = express.Router();

router.post(
  "/login-client-app",
  Validator.validate(),
  Middleware.handleValidationError,
  Middleware.isAuthorizeForLogin,
  loginApp
);

export default router;
