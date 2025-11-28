"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMapelValidation = void 0;
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
exports.createMapelValidation = [
    (0, express_validator_1.body)("namaMapel").notEmpty().withMessage("Nama mata pelajaran wajib diisi"),
    (0, express_validator_1.body)("kategori")
        .notEmpty()
        .withMessage("Kategori wajib diisi")
        .isIn(Object.values(prisma_1.MapelCategory))
        .withMessage(`Kategori tidak valid. Pilih dari: ${Object.values(prisma_1.MapelCategory).join(", ")}`),
    validationHandler,
];
