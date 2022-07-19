import { body, param, query } from "express-validator";

class ClientappValidator {
  validate() {
    return [
      body("password").notEmpty().withMessage("password should not be empty"),
    ];
  }

  validateForRefresh() {
    return [
      body("password").notEmpty().withMessage("password should not be empty"),
    ];
  }
}

export default new ClientappValidator();
