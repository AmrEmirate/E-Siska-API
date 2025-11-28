"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputEkskulValidation = void 0;
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
exports.inputEkskulValidation = [
    (0, express_validator_1.body)("guruId").isUUID().withMessage("Format guruId tidak valid"),
    (0, express_validator_1.body)("mapelId").isUUID().withMessage("Format mapelId tidak valid"),
    (0, express_validator_1.body)("data")
        .isArray({ min: 1 })
        .withMessage("Data nilai harus berupa array dan tidak boleh kosong"),
    (0, express_validator_1.body)("data.*.siswaId").isUUID().withMessage("Format siswaId tidak valid"),
    (0, express_validator_1.body)("data.*.deskripsi")
        .notEmpty()
        .withMessage("Deskripsi wajib diisi")
        .isString()
        .withMessage("Deskripsi harus berupa teks"),
    validationHandler,
];
