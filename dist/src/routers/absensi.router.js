"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const absensi_controller_1 = __importDefault(require("../controllers/absensi.controller"));
const absensiDetail_controller_1 = __importDefault(require("../controllers/absensiDetail.controller"));
const absensi_validation_1 = require("../middleware/validation/absensi.validation");
const absensiDetail_validation_1 = require("../middleware/validation/absensiDetail.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class AbsensiRouter {
    route;
    absensiController;
    absensiDetailController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.absensiController = new absensi_controller_1.default();
        this.absensiDetailController = new absensiDetail_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.get("/", auth_middleware_1.authMiddleware, (req, res) => {
            res.status(200).send({
                success: true,
                message: "Data absensi berhasil diambil",
                data: [],
            });
        });
        this.route.post("/sesi", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, absensi_validation_1.createSesiValidation, this.absensiController.createSesi);
        this.route.get("/kelas/:kelasId", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.absensiController.getSesiByKelas);
        this.route.get("/sesi/:sesiId", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.absensiController.getSesiDetail);
        this.route.post("/sesi/:sesiId/detail", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, absensiDetail_validation_1.inputAbsensiValidation, this.absensiDetailController.inputAbsensi);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = AbsensiRouter;
