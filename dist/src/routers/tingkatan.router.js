"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tingkatan_controller_1 = __importDefault(require("../controllers/tingkatan.controller"));
const tingkatan_validation_1 = require("../middleware/validation/tingkatan.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class TingkatanRouter {
    route;
    tingkatanController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.tingkatanController = new tingkatan_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, tingkatan_validation_1.createTingkatanValidation, this.tingkatanController.create);
        this.route.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.tingkatanController.getAll);
        this.route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, tingkatan_validation_1.createTingkatanValidation, this.tingkatanController.update);
        this.route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.tingkatanController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = TingkatanRouter;
