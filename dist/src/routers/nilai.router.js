"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nilai_controller_1 = __importDefault(require("../controllers/nilai.controller"));
const nilai_validation_1 = require("../middleware/validation/nilai.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class NilaiRouter {
    route;
    nilaiController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.nilaiController = new nilai_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.get("/", auth_middleware_1.authMiddleware, this.nilaiController.getAll);
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, nilai_validation_1.inputNilaiValidation, this.nilaiController.inputNilai);
        this.route.get("/kelas/:kelasId/mapel/:mapelId", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.nilaiController.getNilaiKelas);
        this.route.get("/me", auth_middleware_1.authMiddleware, auth_middleware_1.siswaGuard, this.nilaiController.getMyGrades);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.nilaiController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.nilaiController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = NilaiRouter;
