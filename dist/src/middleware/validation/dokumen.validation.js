"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDokumenValidation = void 0;
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
exports.createDokumenValidation = [
    (0, express_validator_1.body)("judul").notEmpty().withMessage("Judul dokumen wajib diisi"),
    validationHandler,
];
