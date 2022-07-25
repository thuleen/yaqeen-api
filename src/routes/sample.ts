import express from "express";
import * as Controller from "../controllers/sample";
import Validator from "../validators/sample";
import Middleware from "../middlewares/sample";

const router = express.Router();

router.post(
  "/create-sample",
  Validator.validateForCreation(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.create
);

router.put(
  "/update-patient",
  Validator.validateForUpdatingPatient(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.updatePatient
);

router.put(
  "/update-photo",
  Validator.validateForUpdatingPhoto(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.updatePhoto
);

router.put(
  "/update-result",
  Validator.validateForUpdateResult(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.updateResult
);

router.post(
  "/samples",
  Validator.validateForGetSamples(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.getSamples
);

export default router;
