"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guru_controller_1 = __importDefault(require("../controllers/guru.controller"));
const guru_validation_1 = require("../middleware/validation/guru.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class GuruRouter {
    route;
    guruController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.guruController = new guru_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, guru_validation_1.createGuruValidation, this.guruController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, this.guruController.getAll);
        this.route.get("/:id", auth_middleware_1.authMiddleware, this.guruController.getById);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.guruController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.guruController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = GuruRouter;
