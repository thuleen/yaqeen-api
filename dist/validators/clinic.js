"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class ClinicValidator {
    validateForRegistration() {
        return [
            (0, express_validator_1.body)("password")
                .notEmpty()
                .withMessage("client app password should not be empty"),
            (0, express_validator_1.body)("name")
                .notEmpty()
                .withMessage("name of the clinic should not be empty"),
            (0, express_validator_1.body)("address")
                .notEmpty()
                .withMessage("address of the clinic should not be empty"),
            (0, express_validator_1.body)("postcode")
                .notEmpty()
                .withMessage("postcode of the clinic should not be empty"),
            (0, express_validator_1.body)("email")
                .notEmpty()
                .withMessage("email of the clinic user should not be empty"),
        ];
    }
    validateForLogin() {
        return [
            (0, express_validator_1.body)("password")
                .notEmpty()
                .withMessage("client app password should not be empty"),
            (0, express_validator_1.body)("email")
                .notEmpty()
                .withMessage("user email should not be empty"),
            (0, express_validator_1.body)("usrPassword")
                .notEmpty()
                .withMessage("c should not be empty"),
        ];
    }
}
exports.default = new ClinicValidator();
