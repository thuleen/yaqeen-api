"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class ClientappValidator {
    validate() {
        return [
            (0, express_validator_1.body)("password").notEmpty().withMessage("password should not be empty"),
        ];
    }
    validateForRefresh() {
        return [
            (0, express_validator_1.body)("password").notEmpty().withMessage("password should not be empty"),
        ];
    }
}
exports.default = new ClientappValidator();
