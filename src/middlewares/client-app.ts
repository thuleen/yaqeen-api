import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { isPasswordMatch } from "../utils";
import * as ClientAppService from "../services/client-app";

const isAuthorize = async (req: Request) => {
  const { password } = req.body;
  const result = await ClientAppService.login(password);
  if (result.status === "Error") {
    return false;
  }
  return true;
};

class Middleware {
  handleValidationError(req: Request, res: Response, next: NextFunction) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json(error.array()[0]);
    }
    next();
  }

  async isAuthorizeForLogin(req: Request, res: Response, next: NextFunction) {
    if (!(await isAuthorize(req))) {
      req.session.isAuth = false;
      req.session.destroy((err) => {
        if (err) throw err;
      });
      return res.status(400).json({ msg: "Unauthorized" });
    }
    next();
  }

  async isAuthorizeForRefresh(req: Request, res: Response, next: NextFunction) {
    if (!(await isAuthorize(req))) {
      req.session.isAuth = false;
      req.session.destroy((err) => {
        if (err) throw err;
      });
      // TODO : Check accountId
      return res.status(400).json({ msg: "Unauthorized" });
    }
    next();
  }
}
export default new Middleware();
