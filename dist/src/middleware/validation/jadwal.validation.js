"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJadwalValidation = void 0;
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
const timeFormatRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
exports.createJadwalValidation = [
    (0, express_validator_1.body)("tahunAjaranId")
        .isUUID()
        .withMessage("Format tahunAjaranId tidak valid"),
    (0, express_validator_1.body)("kelasId").isUUID().withMessage("Format kelasId tidak valid"),
    (0, express_validator_1.body)("mapelId").isUUID().withMessage("Format mapelId tidak valid"),
    (0, express_validator_1.body)("guruId").isUUID().withMessage("Format guruId tidak valid"),
    (0, express_validator_1.body)("ruanganId").isUUID().withMessage("Format ruanganId tidak valid"),
    (0, express_validator_1.body)("hari").notEmpty().withMessage("Hari wajib diisi"),
    (0, express_validator_1.body)("waktuMulai")
        .notEmpty()
        .withMessage("Waktu mulai wajib diisi")
        .matches(timeFormatRegex)
        .withMessage("Format waktuMulai harus HH:MM (contoh: 07:30)"),
    (0, express_validator_1.body)("waktuSelesai")
        .notEmpty()
        .withMessage("Waktu selesai wajib diisi")
        .matches(timeFormatRegex)
        .withMessage("Format waktuSelesai harus HH:MM (contoh: 09:00)"),
    validationHandler,
];
