"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByUsernameRepo = void 0;
const prisma_1 = require("../config/prisma");
const findUserByUsernameRepo = async (username) => {
    return prisma_1.prisma.user.findUnique({
        where: {
            username: username,
        },
    });
};
exports.findUserByUsernameRepo = findUserByUsernameRepo;
