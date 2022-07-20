import { Request, Response } from "express";
// import * as ClientAppService from "../services/client-app";

const create = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Logged in" });
};
export { create };
