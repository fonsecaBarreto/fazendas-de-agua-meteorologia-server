"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = __importDefault(require("cors"));
var UserAuthentication_1 = require("../V1/middlewares/UserAuthentication");
exports.default = (function (app) {
    app.use(function (req, res, next) {
        console.log("\n > Nova Requisição:", req.method, req.path);
        next();
    });
    app.use((0, cors_1.default)());
    app.use((0, express_1.json)());
    app.use((0, express_1.urlencoded)({ extended: true }));
    app.use(UserAuthentication_1.AuthenticateUserMiddleware);
});
//# sourceMappingURL=middlewares.js.map