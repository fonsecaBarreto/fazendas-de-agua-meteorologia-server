"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.RemoveAddresController = exports.FindAddresController = exports.UpdateAddressController = exports.CreateAddressController = void 0;
var BaseController_1 = require("../../Protocols/BaseController");
var Http_1 = require("../../Protocols/Http");
var AddressSchemas_1 = require("../../Models/Schemas/AddressSchemas");
var AddressesErrors_1 = require("../../../domain/Errors/AddressesErrors");
var UsersErrors_1 = require("../../../domain/Errors/UsersErrors");
var CreateAddressController = (function (_super) {
    __extends(CreateAddressController, _super);
    function CreateAddressController(addressesServices) {
        var _this = _super.call(this, BaseController_1.AccessType.ADMIN, { body: AddressSchemas_1.Address_BodySchema }) || this;
        _this.addressesServices = addressesServices;
        return _this;
    }
    CreateAddressController.prototype.handler = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, city, details, uf, street, region, postalCode, number, address, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, city = _a.city, details = _a.details, uf = _a.uf, street = _a.street, region = _a.region, postalCode = _a.postalCode, number = _a.number;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, this.addressesServices.create({ city: city, details: details, uf: uf, street: street, region: region, postalCode: postalCode, number: number })];
                    case 2:
                        address = _b.sent();
                        return [2, (0, BaseController_1.Ok)(address)];
                    case 3:
                        err_1 = _b.sent();
                        if (err_1 instanceof AddressesErrors_1.AddressUfInvalidError)
                            return [2, (0, BaseController_1.BadRequest)(err_1.message)];
                        throw err_1;
                    case 4: return [2];
                }
            });
        });
    };
    return CreateAddressController;
}(BaseController_1.BaseController));
exports.CreateAddressController = CreateAddressController;
var UpdateAddressController = (function (_super) {
    __extends(UpdateAddressController, _super);
    function UpdateAddressController(addressesServices) {
        var _this = _super.call(this, BaseController_1.AccessType.ADMIN, {
            body: AddressSchemas_1.Address_BodySchema,
            params: AddressSchemas_1.Address_ParamsSchema
        }) || this;
        _this.addressesServices = addressesServices;
        return _this;
    }
    UpdateAddressController.prototype.handler = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, city, details, uf, street, region, postalCode, number, address, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = request.params.id;
                        _a = request.body, city = _a.city, details = _a.details, uf = _a.uf, street = _a.street, region = _a.region, postalCode = _a.postalCode, number = _a.number;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, this.addressesServices.update(id, { city: city, details: details, uf: uf, street: street, region: region, postalCode: postalCode, number: number })];
                    case 2:
                        address = _b.sent();
                        return [2, (0, BaseController_1.Ok)(address)];
                    case 3:
                        err_2 = _b.sent();
                        if (err_2 instanceof AddressesErrors_1.AddressNotFoundError) {
                            return [2, (0, Http_1.NotFound)(err_2.message)];
                        }
                        if (err_2 instanceof AddressesErrors_1.AddressUfInvalidError) {
                            return [2, (0, BaseController_1.BadRequest)(err_2.message)];
                        }
                        throw err_2;
                    case 4: return [2];
                }
            });
        });
    };
    return UpdateAddressController;
}(BaseController_1.BaseController));
exports.UpdateAddressController = UpdateAddressController;
var FindAddresController = (function (_super) {
    __extends(FindAddresController, _super);
    function FindAddresController(addressesServices) {
        var _this = _super.call(this, BaseController_1.AccessType.ADMIN, {
            params: AddressSchemas_1.Address_ParamsSchema
        }) || this;
        _this.addressesServices = addressesServices;
        return _this;
    }
    FindAddresController.prototype.handler = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user, users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = request.params.id;
                        if (!id) return [3, 2];
                        return [4, this.addressesServices.find(id)];
                    case 1:
                        user = _a.sent();
                        return [2, (0, BaseController_1.Ok)(user)];
                    case 2: return [4, this.addressesServices.list()];
                    case 3:
                        users = _a.sent();
                        return [2, (0, BaseController_1.Ok)(users)];
                }
            });
        });
    };
    return FindAddresController;
}(BaseController_1.BaseController));
exports.FindAddresController = FindAddresController;
var RemoveAddresController = (function (_super) {
    __extends(RemoveAddresController, _super);
    function RemoveAddresController(addressesServices) {
        var _this = _super.call(this, BaseController_1.AccessType.ADMIN, {
            params: AddressSchemas_1.Address_RemoveParamsSchema
        }) || this;
        _this.addressesServices = addressesServices;
        return _this;
    }
    RemoveAddresController.prototype.handler = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var id, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = request.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.addressesServices.remove(id)];
                    case 2:
                        _a.sent();
                        return [2, (0, BaseController_1.Ok)()];
                    case 3:
                        err_3 = _a.sent();
                        if (err_3 instanceof UsersErrors_1.UserNotFoundError) {
                            return [2, (0, BaseController_1.BadRequest)(err_3)];
                        }
                        throw err_3;
                    case 4: return [2];
                }
            });
        });
    };
    return RemoveAddresController;
}(BaseController_1.BaseController));
exports.RemoveAddresController = RemoveAddresController;
//# sourceMappingURL=Addresses.Controller.js.map