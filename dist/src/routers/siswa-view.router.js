"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const siswa_view_controller_1 = __importDefault(require("../controllers/siswa-view.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
class SiswaViewRouter {
    route;
    siswaViewController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.siswaViewController = new siswa_view_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.get("/my/absensi", auth_middleware_1.authMiddleware, auth_middleware_1.siswaGuard, this.siswaViewController.getMyAbsensi);
        this.route.get("/my/nilai", auth_middleware_1.authMiddleware, auth_middleware_1.siswaGuard, this.siswaViewController.getMyNilai);
        this.route.get("/my/jadwal", auth_middleware_1.authMiddleware, auth_middleware_1.siswaGuard, this.siswaViewController.getMyJadwal);
        this.route.get("/pengumuman", auth_middleware_1.authMiddleware, auth_middleware_1.siswaGuard, this.siswaViewController.getPengumuman);
        this.route.get("/dokumen", auth_middleware_1.authMiddleware, auth_middleware_1.siswaGuard, this.siswaViewController.getDokumen);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = SiswaViewRouter;
