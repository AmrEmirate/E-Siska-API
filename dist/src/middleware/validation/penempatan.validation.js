"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPenempatanValidation = void 0;
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
exports.createPenempatanValidation = [
    (0, express_validator_1.body)("siswaId")
        .notEmpty()
        .withMessage("siswaId wajib diisi")
        .isUUID()
        .withMessage("Format siswaId tidak valid"),
    (0, express_validator_1.body)("kelasId")
        .notEmpty()
        .withMessage("kelasId wajib diisi")
        .isUUID()
        .withMessage("Format kelasId tidak valid"),
    (0, express_validator_1.body)("tahunAjaranId")
        .notEmpty()
        .withMessage("tahunAjaranId wajib diisi")
        .isUUID()
        .withMessage("Format tahunAjaranId tidak valid"),
    validationHandler,
];
