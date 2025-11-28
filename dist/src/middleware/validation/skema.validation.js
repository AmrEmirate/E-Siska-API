"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addKomponenValidation = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = require("../../generated/prisma");
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
exports.addKomponenValidation = [
    (0, express_validator_1.param)("skemaId")
        .notEmpty()
        .withMessage("skemaId URL parameter wajib diisi")
        .isUUID()
        .withMessage("Format skemaId tidak valid"),
    (0, express_validator_1.body)("namaKomponen")
        .notEmpty()
        .withMessage("Nama komponen wajib diisi")
        .isString(),
    (0, express_validator_1.body)("tipe")
        .notEmpty()
        .withMessage("Tipe komponen wajib diisi")
        .isIn(Object.values(prisma_1.NilaiKomponenType))
        .withMessage(`Tipe tidak valid. Pilih dari: ${Object.values(prisma_1.NilaiKomponenType).join(", ")}`),
    (0, express_validator_1.body)("urutan")
        .notEmpty()
        .withMessage("Urutan wajib diisi")
        .isInt({ min: 1 })
        .withMessage("Urutan harus angka positif"),
    (0, express_validator_1.body)("formula").optional().isString(),
    validationHandler,
];
