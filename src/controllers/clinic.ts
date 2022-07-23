import { Request, Response } from "express";
import * as service from "../services/clinic";
import { OK, UNAUTHORIZED, FORBIDDEN } from "../http-status-code";

const register = async (req: Request, res: Response) => {
  const { name, address, postcode, email } = req.body;
  const result = await service.register({ name, address, postcode, email });
  if (result.status === "Error") {
    res.status(OK).json(result); // status OK because we want to app to consume the message
    return;
  }
  res.status(OK).json(result);
};
export { register };

const loginUsr = async (req: Request, res: Response) => {
  const { email, usrPassword } = req.body;
  const result = await service.loginUsr({
    email: email,
    password: usrPassword,
  });
  if (result.status === "Error") {
    res.status(OK).json(result); // status OK because we want to app to consume the message
    return;
  }
  res.status(OK).json(result);
};
export { loginUsr };

const updateUsr = async (req: Request, res: Response) => {
  const result = await service.updateUsr({ ...req.body });
  if (result.status === "Error") {
    res.status(OK).json(result); // status OK because we want to app to consume the message
    return;
  }
  res.status(OK).json(result);
};
export { updateUsr };
