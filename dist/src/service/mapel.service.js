"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMapelService = exports.deleteMapelService = exports.updateMapelService = exports.createMapelService = void 0;
const mapel_repository_1 = require("../repositories/mapel.repository");
const logger_1 = __importDefault(require("../utils/logger"));
const createMapelService = async (data) => {
    logger_1.default.info(`Mencoba membuat mata pelajaran: ${data.namaMapel}`);
    const repoInput = {
        namaMapel: data.namaMapel,
        kategori: data.kategori,
        adminId: data.adminId,
    };
    const newData = await (0, mapel_repository_1.createMapelRepo)(repoInput);
    return newData;
};
exports.createMapelService = createMapelService;
const updateMapelService = async (id, data) => {
    logger_1.default.info(`Mencoba update mata pelajaran: ${id}`);
    const updateData = { ...data };
    if (data.kategori) {
        updateData.kategori = data.kategori;
    }
    return await (0, mapel_repository_1.updateMapelRepo)(id, updateData);
};
exports.updateMapelService = updateMapelService;
const deleteMapelService = async (id) => {
    logger_1.default.info(`Mencoba hapus mata pelajaran: ${id}`);
    return await (0, mapel_repository_1.deleteMapelRepo)(id);
};
exports.deleteMapelService = deleteMapelService;
const getAllMapelService = async () => {
    logger_1.default.info(`Fetching all mata pelajaran`);
    return await (0, mapel_repository_1.getAllMapelRepo)();
};
exports.getAllMapelService = getAllMapelService;
