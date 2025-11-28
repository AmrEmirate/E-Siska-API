"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRaporValidation = exports.inputRaporValidation = void 0;
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
exports.inputRaporValidation = [
    (0, express_validator_1.param)("siswaId").isUUID().withMessage("Format siswaId tidak valid"),
    (0, express_validator_1.body)("guruId").isUUID().withMessage("Format guruId tidak valid"),
    (0, express_validator_1.body)("tahunAjaranId")
        .isUUID()
        .withMessage("Format tahunAjaranId tidak valid"),
    (0, express_validator_1.body)("catatan").optional().isString(),
    (0, express_validator_1.body)("kokurikuler").optional().isString(),
    validationHandler,
];
exports.generateRaporValidation = [
    (0, express_validator_1.param)("siswaId").isUUID().withMessage("Format siswaId tidak valid"),
    (0, express_validator_1.body)("tahunAjaranId")
        .isUUID()
        .withMessage("Format tahunAjaranId tidak valid"),
    (0, express_validator_1.body)("guruId").isUUID().withMessage("Format guruId tidak valid"),
    validationHandler,
];
