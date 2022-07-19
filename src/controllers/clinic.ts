import { Request, Response } from "express";
import { register } from "../services/clinic";

const registerClinic = async (req: Request, res: Response) => {
  const { name, address, postcode, email } = req.body;
  const result = await register({ name, address, postcode, email });
  if (result.status === "Error") {
    res.status(400).json(result);
    return;
  }
  res.status(200).json(result);
};
export { registerClinic };
