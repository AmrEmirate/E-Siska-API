"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const penugasan_controller_1 = __importDefault(require("../controllers/penugasan.controller"));
const penugasan_validation_1 = require("../middleware/validation/penugasan.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class PenugasanRouter {
    route;
    penugasanController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.penugasanController = new penugasan_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, penugasan_validation_1.createPenugasanValidation, this.penugasanController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.penugasanController.getAll);
        this.route.get("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.penugasanController.getById);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, penugasan_validation_1.createPenugasanValidation, this.penugasanController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.penugasanController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = PenugasanRouter;
