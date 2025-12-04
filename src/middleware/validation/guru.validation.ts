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
export const createGuruValidation = [
  body("nama").notEmpty().withMessage("Nama guru wajib diisi"),
  body("nip")
    .notEmpty()
    .withMessage("NIP wajib diisi")
    .isLength({ min: 18, max: 18 })
    .withMessage("NIP harus tepat 18 digit")
    .matches(/^\d+$/)
    .withMessage("NIP harus berupa angka"),
  body("nik")
    .optional()
    .isLength({ min: 16, max: 16 })
    .withMessage("NIK harus tepat 16 digit")
    .matches(/^\d+$/)
    .withMessage("NIK harus berupa angka"),
  body("nuptk")
    .optional()
    .isLength({ min: 16, max: 16 })
    .withMessage("NUPTK harus tepat 16 digit")
    .matches(/^\d+$/)
    .withMessage("NUPTK harus berupa angka"),
  body("email").optional().isEmail().withMessage("Format email tidak valid"),
  validationHandler,
];
