"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const capaian_controller_1 = __importDefault(require("../controllers/capaian.controller"));
const capaian_validation_1 = require("../middleware/validation/capaian.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class CapaianRouter {
    route;
    capaianController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.capaianController = new capaian_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, capaian_validation_1.inputCapaianValidation, this.capaianController.inputCapaian);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = CapaianRouter;
