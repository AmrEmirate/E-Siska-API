"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGuruValidation = void 0;
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
exports.createGuruValidation = [
    (0, express_validator_1.body)("nama").notEmpty().withMessage("Nama guru wajib diisi"),
    (0, express_validator_1.body)("nip").notEmpty().withMessage("NIP wajib diisi"),
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username login wajib diisi"),
    (0, express_validator_1.body)("passwordDefault")
        .notEmpty()
        .withMessage("Password default wajib diisi")
        .isLength({ min: 6 })
        .withMessage("Password default minimal 6 karakter"),
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Format email tidak valid"),
    validationHandler,
];
