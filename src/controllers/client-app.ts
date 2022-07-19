import { Request, Response } from "express";
// import * as ClientAppService from "../services/client-app";

declare module "express-session" {
  interface Session {
    isAuth: boolean;
  }
}

const loginApp = async (req: Request, res: Response) => {
  req.session.isAuth = true;
  res.status(200).json({ message: "Logged in" });
};
export { loginApp };

const refreshSession = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  req.session.touch();
  req.session.isAuth = true;
  res
    .status(200)
    .json({ status: "OK", message: "Successfully refreshed session" });
};
export { refreshSession };
