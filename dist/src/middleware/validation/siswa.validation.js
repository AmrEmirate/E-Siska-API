"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSiswaValidation = void 0;
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
exports.createSiswaValidation = [
    (0, express_validator_1.body)("nama").notEmpty().withMessage("Nama siswa wajib diisi"),
    (0, express_validator_1.body)("nis")
        .notEmpty()
        .withMessage("NIS wajib diisi")
        .isLength({ min: 6 })
        .withMessage("NIS harus memiliki minimal 6 digit"),
    (0, express_validator_1.body)("tanggalLahir")
        .optional()
        .isISO8601()
        .withMessage("Format tanggal lahir harus YYYY-MM-DD"),
    validationHandler,
];
