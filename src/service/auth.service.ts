import { compare } from "bcrypt";
import AppError from "../utils/AppError";
import { createToken } from "../utils/createToken";
import { findUserByUsernameRepo } from "../repositories/user.repository";

export const loginService = async (data: {
  username: string;
  password: string;
}) => {
  const user = await findUserByUsernameRepo(data.username);

  if (!user) {
    throw new AppError("Akun tidak ditemukan", 404);
  }

  const comparePass = await compare(data.password, user.passwordHash);
  if (!comparePass) {
    throw new AppError("Password salah", 400);
  }

  const { passwordHash, ...accountData } = user;

  // Extract nama, nip, nisn from related tables
  let nama: string | null = null;
  let nip: string | null = null;
  let nisn: string | null = null;
  let guruId: string | null = null;
  let siswaId: string | null = null;

  if (user.guru) {
    nama = user.guru.nama;
    nip = user.guru.nip;
    guruId = user.guru.id;
  } else if (user.siswa) {
    nama = user.siswa.nama;
    nisn = user.siswa.nisn;
    siswaId = user.siswa.id;
  } else if (user.admin) {
    nama = user.admin.nama;
  }

  const token = createToken(accountData, "24h");

  return {
    ...accountData,
    nama,
    nip,
    nisn,
    guruId,
    siswaId,
    token,
  };
};
