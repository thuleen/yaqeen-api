import { Request, Response } from "express";
import * as service from "../services/sample";
import { OK, UNAUTHORIZED, FORBIDDEN } from "../http-status-code";

// create a sample
const create = async (req: Request, res: Response) => {
  const result = await service.create({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { create };

const updatePatient = async (req: Request, res: Response) => {
  const result = await service.updatePatient({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { updatePatient };

const updatePhoto = async (req: Request, res: Response) => {
  const result = await service.updatePhoto({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { updatePhoto };

const updateResult = async (req: Request, res: Response) => {
  const result = await service.updateResult({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { updateResult };

const deleteSample = async (req: Request, res: Response) => {
  const result = await service.deleteSample({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { deleteSample };

const getSamples = async (req: Request, res: Response) => {
  const result = await service.getSamples({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { getSamples };

// most called by Patient app
const getPatientSamples = async (req: Request, res: Response) => {
  const result = await service.getPatientSamples({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { getPatientSamples };
