"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRuanganValidation = void 0;
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
exports.createRuanganValidation = [
    (0, express_validator_1.body)("namaRuangan").notEmpty().withMessage("Nama ruangan wajib diisi"),
    (0, express_validator_1.body)("kapasitas")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Kapasitas harus berupa angka positif"),
    validationHandler,
];
