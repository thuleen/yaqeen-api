import { Request, Response } from "express";
import { create, updatePhoto, getSamples } from "../services/sample";
import { OK, UNAUTHORIZED, FORBIDDEN } from "../http-status-code";

// create a sample
const createSample = async (req: Request, res: Response) => {
  const result = await create({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { createSample };

const updateSamplePhoto = async (req: Request, res: Response) => {
  const result = await updatePhoto({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { updateSamplePhoto };

const getAllSamples = async (req: Request, res: Response) => {
  const result = await getSamples({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { getAllSamples };
