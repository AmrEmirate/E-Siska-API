"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kelas_controller_1 = __importDefault(require("../controllers/kelas.controller"));
const kelas_validation_1 = require("../middleware/validation/kelas.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class KelasRouter {
    route;
    kelasController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.kelasController = new kelas_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, kelas_validation_1.createKelasValidation, this.kelasController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, this.kelasController.getAll);
        this.route.get("/my-class", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.kelasController.getMyClass);
        this.route.get("/teaching", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, this.kelasController.getMyTeachingClasses);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.kelasController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.kelasController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = KelasRouter;
