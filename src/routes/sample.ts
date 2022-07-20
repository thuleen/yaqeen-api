import express from "express";
import { create } from "../controllers/sample";
// import { default as Validator } from "../validators/sample";
// import { default as Middleware } from "../middlewares/sample";

const router = express.Router();

router.post(
  "/create-sample",
  // Validator.validate(),
  // Middleware.handleValidationError,
  // Middleware.isAuthorizeForLogin,
  create
);

export default router;
