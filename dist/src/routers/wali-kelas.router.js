"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wali_kelas_controller_1 = __importDefault(require("../controllers/wali-kelas.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
class WaliKelasRouter {
    route;
    waliKelasController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.waliKelasController = new wali_kelas_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.get("/my-kelas", auth_middleware_1.authMiddleware, auth_middleware_1.waliKelasGuard, this.waliKelasController.getMyKelas);
        this.route.get("/kelas/:kelasId/rekap-nilai", auth_middleware_1.authMiddleware, auth_middleware_1.waliKelasGuard, this.waliKelasController.getRekapNilai);
        this.route.get("/kelas/:kelasId/rekap-absensi", auth_middleware_1.authMiddleware, auth_middleware_1.waliKelasGuard, this.waliKelasController.getRekapAbsensi);
        this.route.get("/kelas/:kelasId/siswa", auth_middleware_1.authMiddleware, auth_middleware_1.waliKelasGuard, this.waliKelasController.getDataSiswa);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = WaliKelasRouter;
