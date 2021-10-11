"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = exports.AccessType = void 0;
var User_1 = require("../../domain/Entities/User");
var Http_1 = require("./Http");
var http_helper_1 = require("./http-helper");
__exportStar(require("./Http"), exports);
var AccessType;
(function (AccessType) {
    AccessType[AccessType["PUBLIC"] = 0] = "PUBLIC";
    AccessType[AccessType["BASIC"] = 1] = "BASIC";
    AccessType[AccessType["ADMIN"] = 2] = "ADMIN";
    AccessType[AccessType["STATION"] = 3] = "STATION";
    AccessType[AccessType["ANY_USER"] = 4] = "ANY_USER";
})(AccessType = exports.AccessType || (exports.AccessType = {}));
var BaseController = (function () {
    function BaseController(accessType, schemas) {
        if (accessType === void 0) { accessType = AccessType.PUBLIC; }
        this.accessType = accessType;
        this.schemas = schemas;
    }
    BaseController.prototype.securityGuard = function (user) {
        if (this.accessType === AccessType.PUBLIC)
            return true;
        if (!user || user.role == null)
            return false;
        switch (this.accessType) {
            case AccessType.BASIC:
                if (user.role != User_1.UsersRole.Basic)
                    return false;
                break;
            case AccessType.ADMIN:
                if (user.role != User_1.UsersRole.Admin)
                    return false;
                break;
            case AccessType.STATION:
                if (user.role != User_1.UsersRole.Station)
                    return false;
                break;
            default: return true;
        }
        return true;
    };
    BaseController.prototype.validationGuard = function (req) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var hasError, hasError;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!((_a = this.schemas) === null || _a === void 0 ? void 0 : _a.body)) return [3, 2];
                        return [4, BaseController._validator.validate((_b = this.schemas) === null || _b === void 0 ? void 0 : _b.body, req.body)];
                    case 1:
                        hasError = _e.sent();
                        if (hasError)
                            return [2, hasError];
                        _e.label = 2;
                    case 2:
                        if (!((_c = this.schemas) === null || _c === void 0 ? void 0 : _c.params)) return [3, 4];
                        return [4, BaseController._validator.validate((_d = this.schemas) === null || _d === void 0 ? void 0 : _d.params, req.params)];
                    case 3:
                        hasError = _e.sent();
                        if (hasError)
                            return [2, hasError];
                        _e.label = 4;
                    case 4: return [2, null];
                }
            });
        });
    };
    BaseController.prototype._handler = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var isSafe, hasErrors, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.securityGuard(request.user)];
                    case 1:
                        isSafe = _a.sent();
                        if (!isSafe)
                            return [2, (0, http_helper_1.Unauthorized)()];
                        return [4, this.validationGuard(request)];
                    case 2:
                        hasErrors = _a.sent();
                        if (hasErrors)
                            return [2, (0, Http_1.Unprocessable)(hasErrors)];
                        return [4, this.handler(request)];
                    case 3:
                        response = _a.sent();
                        return [2, response];
                }
            });
        });
    };
    BaseController.prototype.execute = function () {
        var _this = this;
        return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var request, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = {
                            headers: req.headers,
                            body: req.body || {},
                            params: req.params,
                            query: req.query,
                            files: req.files,
                            user: req.user
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this._handler(request)];
                    case 2:
                        response = _a.sent();
                        if (response.status >= 400) {
                            console.log("\n ** ClientError: ", response.body.name);
                            return [2, res.status(response.status).json({ error: response.body })];
                        }
                        res.status(response.status).json(response.body);
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log(console.log("\n ** ServerError: ", err_1.stack));
                        return [2, res.status(500).json({ error: "Erro no Servidor" })];
                    case 4: return [2];
                }
            });
        }); };
    };
    return BaseController;
}());
exports.BaseController = BaseController;
//# sourceMappingURL=BaseController.js.map