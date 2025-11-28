"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputAbsensiValidation = void 0;
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
exports.inputAbsensiValidation = [
    (0, express_validator_1.param)("sesiId").isUUID().withMessage("Format sesiId tidak valid"),
    (0, express_validator_1.body)("data")
        .isArray({ min: 1 })
        .withMessage("Data absensi harus berupa array dan tidak boleh kosong"),
    (0, express_validator_1.body)("data.*.siswaId").isUUID().withMessage("Format siswaId tidak valid"),
    (0, express_validator_1.body)("data.*.status")
        .isIn(Object.values(prisma_1.AbsensiStatus))
        .withMessage(`Status harus salah satu dari: ${Object.values(prisma_1.AbsensiStatus).join(", ")}`),
    validationHandler,
];
