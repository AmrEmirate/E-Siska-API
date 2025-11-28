"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ruangan_controller_1 = __importDefault(require("../controllers/ruangan.controller"));
const ruangan_validation_1 = require("../middleware/validation/ruangan.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
class RuanganRouter {
    route;
    ruanganController;
    constructor() {
        this.route = (0, express_1.Router)();
        this.ruanganController = new ruangan_controller_1.default();
        this.initializeRoute();
    }
    initializeRoute() {
        this.route.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, ruangan_validation_1.createRuanganValidation, this.ruanganController.create);
        this.route.get('/', auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.ruanganController.getAll);
        this.route.put('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.ruanganController.update);
        this.route.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminGuard, this.ruanganController.delete);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = RuanganRouter;
