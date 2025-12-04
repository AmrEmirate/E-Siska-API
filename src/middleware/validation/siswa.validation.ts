import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
      throw errorValidation.array();
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const createSiswaValidation = [
  body("nama").notEmpty().withMessage("Nama siswa wajib diisi"),
  body("nisn")
    .notEmpty()
    .withMessage("NISN wajib diisi")
    .isLength({ min: 10, max: 10 })
    .withMessage("NISN harus tepat 10 digit")
    .matches(/^\d+$/)
    .withMessage("NISN harus berupa angka"),
  body("nik")
    .optional()
    .isLength({ min: 16, max: 16 })
    .withMessage("NIK harus tepat 16 digit")
    .matches(/^\d+$/)
    .withMessage("NIK harus berupa angka"),
  body("tanggalLahir")
    .optional()
    .isISO8601()
    .withMessage("Format tanggal lahir harus YYYY-MM-DD"),
  validationHandler,
];
