import { body, param, query } from "express-validator";

class ClinicValidator {
  validateForRegistration() {
    return [
      body("password")
        .notEmpty()
        .withMessage("client app password should not be empty"),
      body("name")
        .notEmpty()
        .withMessage("name of the clinic should not be empty"),
      body("address")
        .notEmpty()
        .withMessage("address of the clinic should not be empty"),
      body("postcode")
        .notEmpty()
        .withMessage("postcode of the clinic should not be empty"),
      body("email")
        .notEmpty()
        .withMessage("email of the clinic user should not be empty"),
    ];
  }
}

export default new ClinicValidator();
