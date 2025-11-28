"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("../config/cloudinary");
const auth_service_1 = require("../service/auth.service");
const AppError_1 = __importDefault(require("../utils/AppError"));
class AuthController {
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                throw new AppError_1.default("Username dan password dibutuhkan", 400);
            }
            const result = await (0, auth_service_1.loginService)({ username, password });
            res.status(200).send({
                success: true,
                message: "Login berhasil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            res.status(200).send({
                success: true,
                message: "Logout berhasil",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async changeProfileImg(req, res, next) {
        try {
            if (!req.file) {
                throw { code: 400, message: "No file uploaded" };
            }
            const upload = await (0, cloudinary_1.cloudinaryUpload)(req.file);
            const userId = req.user?.id || "USER_ID_DARI_TOKEN";
            res.status(200).send({
                success: true,
                message: "Change image profile success",
                imageUrl: upload.secure_url,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = AuthController;
