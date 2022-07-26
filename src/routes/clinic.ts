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

router.put(
  "/update-clinic-name",
  Validator.validateClinicName(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.updateClinicNme
);

router.put(
  "/update-clinic-address",
  Validator.validateClinicAddr(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.updateClinicAddr
);

router.put(
  "/update-clinic-postcode",
  Validator.validateClinicPostcode(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.updateClinicPostcode
);

export default router;
