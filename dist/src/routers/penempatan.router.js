"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const penempatan_controller_1 = __importDefault(require("../controllers/penempatan.controller"));
const penempatan_validation_1 = require("../middleware/validation/penempatan.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class PenempatanRouter {
    route;
    penempatanController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.penempatanController = new penempatan_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, penempatan_validation_1.createPenempatanValidation, this.penempatanController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, this.penempatanController.getAll);
        this.route.get("/:id", auth_middleware_1.authMiddleware, this.penempatanController.getById);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, penempatan_validation_1.createPenempatanValidation, this.penempatanController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.penempatanController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = PenempatanRouter;
