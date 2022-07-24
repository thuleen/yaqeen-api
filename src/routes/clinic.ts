import express from "express";
import * as Controller from "../controllers/clinic";
import { default as Validator } from "../validators/clinic";
import { default as Middleware } from "../middlewares/clinic";

const router = express.Router();

router.post(
  "/register-clinic",
  Validator.validateForRegistration(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.register
);

router.post(
  "/login-clinic-user",
  Validator.validateUser(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.loginUsr
);

router.put(
  "/update-clinic-user",
  Validator.validateUser(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.updateUsr
);

export default router;
