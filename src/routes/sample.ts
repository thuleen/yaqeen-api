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
  "/update-sample-photo",
  Validator.validateForUpdating(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.updatePhoto
);

router.post(
  "/samples",
  Validator.validateForGetSamples(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  Controller.getSamples
);

export default router;
