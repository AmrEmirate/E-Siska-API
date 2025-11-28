"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = void 0;
const bcrypt_1 = require("bcrypt");
const AppError_1 = __importDefault(require("../utils/AppError"));
const createToken_1 = require("../utils/createToken");
const user_repository_1 = require("../repositories/user.repository");
const loginService = async (data) => {
    const user = await (0, user_repository_1.findUserByUsernameRepo)(data.username);
    if (!user) {
        throw new AppError_1.default("Akun tidak ditemukan", 404);
    }
    const comparePass = await (0, bcrypt_1.compare)(data.password, user.passwordHash);
    if (!comparePass) {
        throw new AppError_1.default("Password salah", 400);
    }
    const { passwordHash, ...accountData } = user;
    const token = (0, createToken_1.createToken)(accountData, "24h");
    return { ...accountData, token };
};
exports.loginService = loginService;
