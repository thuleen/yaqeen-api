import express from "express";
import {
  createSample,
  updateSamplePhoto,
  getAllSamples,
} from "../controllers/sample";
import Validator from "../validators/sample";
import Middleware from "../middlewares/sample";

const router = express.Router();

router.post(
  "/create-sample",
  Validator.validateForCreation(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  createSample
);

router.put(
  "/update-sample-photo",
  Validator.validateForUpdating(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  updateSamplePhoto
);

router.post(
  "/samples",
  Validator.validateForGetSamples(),
  Middleware.handleValidationError,
  Middleware.isAuthorize,
  getAllSamples
);

export default router;
