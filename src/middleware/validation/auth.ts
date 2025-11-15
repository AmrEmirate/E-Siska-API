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

export const regisValidation = [
  // ... (kode regisValidation tetap sama)
  body("email").notEmpty().isEmail().withMessage("Email is required"),
  body("password").notEmpty().isStrongPassword({
    minLength: 4,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  }),
  validationHandler,
];

// ### PERUBAHAN DI SINI ###
export const loginValidation = [
  // Diubah dari email ke username
  body("username").notEmpty().withMessage("Username is required"), 
  body("password").notEmpty().withMessage("Password is required"),
  validationHandler,
];