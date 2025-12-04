import { prisma } from "../config/prisma";

export const findUserByUsernameRepo = async (username: string) => {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      guru: true,
      siswa: true,
      admin: true,
    },
  });
};
