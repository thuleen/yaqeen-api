import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as ClientAppService from "../services/client-app";
import { OK, UNAUTHORIZED, FORBIDDEN } from "../http-status-code";

class Middleware {
  handleValidationError(req: Request, res: Response, next: NextFunction) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(UNAUTHORIZED).json(error.array()[0]);
    }
    next();
  }

  async isAuthorize(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    const result = await ClientAppService.login(password);
    if (result.status === "Error") {
      req.session.isAuth = false;
      req.session.destroy((err) => {
        if (err) throw err;
      });
      return res.status(UNAUTHORIZED).json({ msg: "Unauthorized" });
    }
    next();
  }
}
export default new Middleware();
