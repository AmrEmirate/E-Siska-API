"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rapor_controller_1 = __importDefault(require("../controllers/rapor.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
class RaporRouter {
    route;
    raporController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.raporController = new rapor_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.put("/siswa/:siswaId", auth_middleware_1.authMiddleware, auth_middleware_1.waliKelasGuard, this.raporController.updateDataRapor);
        this.route.post("/siswa/:siswaId/generate", auth_middleware_1.authMiddleware, auth_middleware_1.waliKelasGuard, this.raporController.generate);
        this.route.post("/siswa/:siswaId/finalize", auth_middleware_1.authMiddleware, auth_middleware_1.waliKelasGuard, this.raporController.finalize);
        this.route.post("/siswa/:siswaId/definalize", auth_middleware_1.authMiddleware, auth_middleware_1.waliKelasGuard, this.raporController.definalize);
        this.route.post("/siswa/:siswaId/override", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.raporController.override);
        this.route.get("/me", auth_middleware_1.authMiddleware, auth_middleware_1.siswaGuard, this.raporController.getMyRapor);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = RaporRouter;
