import { Request, Response } from "express";
import { create } from "../services/sample";
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
