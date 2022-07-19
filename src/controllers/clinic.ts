import { Request, Response } from "express";
import { create } from "../services/clinic";
import { OK, UNAUTHORIZED, FORBIDDEN } from "../http-status-code";

const register = async (req: Request, res: Response) => {
  const { name, address, postcode, email } = req.body;
  const result = await create({ name, address, postcode, email });
  if (result.status === "Error") {
    res.status(UNAUTHORIZED).json(result);
    return;
  }
  res.status(OK).json(result);
};
export { register };
