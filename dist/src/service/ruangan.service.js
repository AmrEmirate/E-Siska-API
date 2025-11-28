"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRuanganService = exports.deleteRuanganService = exports.updateRuanganService = exports.createRuanganService = void 0;
const ruangan_repository_1 = require("../repositories/ruangan.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const createRuanganService = async (data) => {
    logger_1.default.info(`Mencoba membuat ruangan: ${data.namaRuangan}`);
    const repoInput = {
        ...data,
    };
    const newRuangan = await (0, ruangan_repository_1.createRuanganRepo)(repoInput);
    return newRuangan;
};
exports.createRuanganService = createRuanganService;
const updateRuanganService = async (id, data) => {
    logger_1.default.info(`Mencoba update ruangan: ${id}`);
    const updateData = { ...data };
    return await (0, ruangan_repository_1.updateRuanganRepo)(id, updateData);
};
exports.updateRuanganService = updateRuanganService;
const deleteRuanganService = async (id) => {
    logger_1.default.info(`Mencoba hapus ruangan: ${id}`);
    return await (0, ruangan_repository_1.deleteRuanganRepo)(id);
};
exports.deleteRuanganService = deleteRuanganService;
const getAllRuanganService = async () => {
    logger_1.default.info(`Mencoba mengambil semua data ruangan`);
    return await (0, ruangan_repository_1.getAllRuanganRepo)();
};
exports.getAllRuanganService = getAllRuanganService;
