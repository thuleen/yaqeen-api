import express from "express";
import { register } from "../controllers/clinic";
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

export default router;
