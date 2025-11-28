"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPengumumanValidation = void 0;
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
exports.createPengumumanValidation = [
    (0, express_validator_1.body)("judul").notEmpty().withMessage("Judul pengumuman wajib diisi"),
    (0, express_validator_1.body)("konten").notEmpty().withMessage("Konten pengumuman wajib diisi"),
    validationHandler,
];
