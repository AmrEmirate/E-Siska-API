"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTingkatanValidation = void 0;
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
exports.createTingkatanValidation = [
    (0, express_validator_1.body)("namaTingkat").notEmpty().withMessage("Nama tingkatan wajib diisi"),
    validationHandler,
];
