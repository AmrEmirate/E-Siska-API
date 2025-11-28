"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.regisValidation = void 0;
const express_validator_1 = require("express-validator");
const validationHandler = (req, res, next) => {
    try {
        const errorValidation = (0, express_validator_1.validationResult)(req);
        if (!errorValidation.isEmpty()) {
            throw errorValidation.array();
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.regisValidation = [
    (0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("Email is required"),
    (0, express_validator_1.body)("password").notEmpty().isStrongPassword({
        minLength: 4,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    }),
    validationHandler,
];
exports.loginValidation = [
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
    validationHandler,
];
