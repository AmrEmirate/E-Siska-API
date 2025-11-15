import { compare } from "bcrypt";
// import { prisma } from "../config/prisma"; // Hapus prisma dari service
import AppError from "../utils/AppError";
import { createToken } from "../utils/createToken";
import { findUserByUsernameRepo } from "../repositories/user.repository"; // Impor repository

export const loginService = async (data: {
  username: string;
  password: string;
}) => {
  // 1. Panggil Repository untuk mengambil data user
  const user = await findUserByUsernameRepo(data.username);

  if (!user) {
    throw new AppError("Akun tidak ditemukan", 404);
  }

  // 2. Logika bisnis (compare password) tetap di service
  const comparePass = await compare(data.password, user.passwordHash);
  if (!comparePass) {
    throw new AppError("Password salah", 400);
  }

  // 3. Menyiapkan data untuk token
  const { passwordHash, ...accountData } = user;

  const token = createToken(accountData, "24h");

  return { ...accountData, token };
};