import { body, param, query } from "express-validator";

class Validator {
  validateForCreation() {
    return [
      body("password")
        .notEmpty()
        .withMessage("client app password should not be empty"),
      body("clinicId").notEmpty().withMessage("clinicId should not be empty"),
      body("tagNo")
        .notEmpty()
        .withMessage("sample tagNo name should not be empty"),
      body("testType")
        .notEmpty()
        .withMessage("sample testType should not be empty"),
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

  validateForUpdating() {
    return [
      body("password")
        .notEmpty()
        .withMessage("client app password should not be empty"),
      body("clinicId").notEmpty().withMessage("clinicId should not be empty"),
      body("tagNo")
        .notEmpty()
        .withMessage("sample tagNo name should not be empty"),
      body("testType")
        .notEmpty()
        .withMessage("sample testType should not be empty"),
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
      body("samplePhotoDataUri")
        .notEmpty()
        .withMessage("samplePhotoDataUri should not be empty"),
    ];
  }
}

export default new Validator();
