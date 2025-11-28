"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPenugasanValidation = void 0;
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
exports.createPenugasanValidation = [
    (0, express_validator_1.body)("guruId")
        .notEmpty()
        .withMessage("guruId wajib diisi")
        .isUUID()
        .withMessage("Format guruId tidak valid"),
    (0, express_validator_1.body)("mapelId")
        .notEmpty()
        .withMessage("mapelId wajib diisi")
        .isUUID()
        .withMessage("Format mapelId tidak valid"),
    (0, express_validator_1.body)("kelasId")
        .notEmpty()
        .withMessage("kelasId wajib diisi")
        .isUUID()
        .withMessage("Format kelasId tidak valid"),
    validationHandler,
];
