"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKelasValidation = void 0;
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
exports.createKelasValidation = [
    (0, express_validator_1.body)("namaKelas").notEmpty().withMessage("Nama kelas wajib diisi"),
    (0, express_validator_1.body)("tingkatanId")
        .notEmpty()
        .withMessage("ID Tingkatan Kelas wajib diisi")
        .isUUID()
        .withMessage("Format ID Tingkatan tidak valid"),
    (0, express_validator_1.body)("waliKelasId")
        .optional()
        .isUUID()
        .withMessage("Format ID Wali Kelas tidak valid"),
    validationHandler,
];
