"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSesiValidation = void 0;
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
exports.createSesiValidation = [
    (0, express_validator_1.body)("guruId").isUUID().withMessage("Format guruId tidak valid"),
    (0, express_validator_1.body)("kelasId").isUUID().withMessage("Format kelasId tidak valid"),
    (0, express_validator_1.body)("tanggal")
        .isISO8601()
        .withMessage("Format tanggal harus YYYY-MM-DD (ISO8601)"),
    (0, express_validator_1.body)("pertemuanKe")
        .isInt({ min: 1 })
        .withMessage("Pertemuan ke harus angka positif"),
    validationHandler,
];
