"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ekskul_controller_1 = __importDefault(require("../controllers/ekskul.controller"));
const ekskul_validation_1 = require("../middleware/validation/ekskul.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class EkskulRouter {
    route;
    ekskulController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.ekskulController = new ekskul_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post("/ekskul", auth_middleware_1.authMiddleware, auth_middleware_1.guruGuard, ekskul_validation_1.inputEkskulValidation, this.ekskulController.inputNilai);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = EkskulRouter;
