import { body, param, query } from "express-validator";

class Validator {
  validateForGetSamples() {
    return [
      body("password")
        .notEmpty()
        .withMessage("client app password should not be empty"),
      body("clinicId").notEmpty().withMessage("clinicId should not be empty"),
    ];
  }
  validateForCreation() {
    return [
      body("password")
        .notEmpty()
        .withMessage("client app password should not be empty"),
      body("lastActiveStep")
        .notEmpty()
        .withMessage("lastActiveStep should not be empty"),
      body("clinicId").notEmpty().withMessage("clinicId should not be empty"),
      body("tagNo")
        .notEmpty()
        .withMessage("sample tagNo name should not be empty"),
      body("testType")
        .notEmpty()
        .withMessage("sample testType should not be empty"),
    ];
  }

  validateForUpdatingPatient() {
    return [
      body("password")
        .notEmpty()
        .withMessage("client app password should not be empty"),
      body("lastActiveStep")
        .notEmpty()
        .withMessage("lastActiveStep should not be empty"),
      body("id").notEmpty().withMessage("sample id should not be empty"),
      body("clinicId").notEmpty().withMessage("clinicId should not be empty"),
      body("name").notEmpty().withMessage("patient name should not be empty"),
      body("mobileNo")
        .notEmpty()
        .withMessage("patient mobileNo should not be empty"),
      body("idType")
        .notEmpty()
        .withMessage("patient idType should not be empty"),
      body("socialId")
        .notEmpty()
        .withMessage("patient socialId should not be empty"),
    ];
  }

  validateForUpdatingPhoto() {
    return [
      body("password")
        .notEmpty()
        .withMessage("client app password should not be empty"),
      body("lastActiveStep")
        .notEmpty()
        .withMessage("lastActiveStep should not be empty"),
      body("id").notEmpty().withMessage("sample id should not be empty"),
      body("clinicId").notEmpty().withMessage("clinicId should not be empty"),
      body("photoUri").notEmpty().withMessage("photoUri should not be empty"),
      body("photoTakenAt")
        .notEmpty()
        .withMessage("photoUri should not be empty"),
    ];
  }
}

export default new Validator();
