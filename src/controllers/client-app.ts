import { Request, Response } from "express";
import { OK, UNAUTHORIZED, FORBIDDEN } from "../http-status-code";
import * as service from "../services/client-app";

declare module "express-session" {
  interface Session {
    isAuth: boolean;
  }
}

const register = async (req: Request, res: Response) => {
  const { password, version } = req.body;
  const r = await service.register({ password, version });
  if (r.status === "Error") {
    res.status(FORBIDDEN).json(r);
    return;
  }
  res.status(OK).json(r);
};
export { register };

const login = async (req: Request, res: Response) => {
  req.session.isAuth = true;
  res.status(OK).json({ message: "Logged in" });
};
export { login };

const refreshSession = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  req.session.touch();
  req.session.isAuth = true;
  res
    .status(OK)
    .json({ status: "OK", message: "Successfully refreshed session" });
};
export { refreshSession };
