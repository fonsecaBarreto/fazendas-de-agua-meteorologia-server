"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesServices = void 0;
var AddressesErrors_1 = require("../../Errors/AddressesErrors");
var UsersErrors_1 = require("../../Errors/UsersErrors");
var ufs_json_1 = __importDefault(require("./ufs.json"));
var ufs_prefixs = Object.values(ufs_json_1.default);
var AddressesServices = (function () {
    function AddressesServices(_addressRepository, _usersRepository, _idGenerator) {
        this._addressRepository = _addressRepository;
        this._usersRepository = _usersRepository;
        this._idGenerator = _idGenerator;
    }
    AddressesServices.prototype.createOrUpdate = function (params, id) {
        return __awaiter(this, void 0, void 0, function () {
            var addressExists, uf, address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) return [3, 2];
                        return [4, this._addressRepository.find(id)];
                    case 1:
                        addressExists = _a.sent();
                        if (!addressExists)
                            throw new AddressesErrors_1.AddressNotFoundError();
                        _a.label = 2;
                    case 2:
                        uf = params.uf.toUpperCase();
                        if (!ufs_prefixs.includes(uf))
                            throw new AddressesErrors_1.AddressUfInvalidError();
                        address = __assign(__assign({}, params), { uf: uf, id: id ? id : this._idGenerator.gen() });
                        return [4, this._addressRepository.upsert(address)];
                    case 3:
                        _a.sent();
                        return [2, address];
                }
            });
        });
    };
    AddressesServices.prototype.create = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.createOrUpdate(params)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    AddressesServices.prototype.update = function (id, address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.createOrUpdate(address, id)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    AddressesServices.prototype.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._addressRepository.find(id)];
                    case 1:
                        address = _a.sent();
                        return [2, address ? address : null];
                }
            });
        });
    };
    AddressesServices.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addresses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._addressRepository.list()];
                    case 1:
                        addresses = _a.sent();
                        return [2, addresses.length > 0 ? addresses : []];
                }
            });
        });
    };
    AddressesServices.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var wasDeleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._addressRepository.remove(id)];
                    case 1:
                        wasDeleted = _a.sent();
                        if (!wasDeleted)
                            throw new AddressesErrors_1.AddressNotFoundError();
                        return [2];
                }
            });
        });
    };
    AddressesServices.prototype.appendUserToAddress = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var user_id, address_id, userExists, addressExists, done;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user_id = params.user_id, address_id = params.address_id;
                        return [4, this._usersRepository.find(user_id)];
                    case 1:
                        userExists = _a.sent();
                        if (!userExists)
                            throw new UsersErrors_1.UserNotFoundError();
                        return [4, this._addressRepository.find(address_id)];
                    case 2:
                        addressExists = _a.sent();
                        if (!addressExists)
                            throw new AddressesErrors_1.AddressNotFoundError();
                        return [4, this._addressRepository.relateUser(user_id, address_id)];
                    case 3:
                        done = _a.sent();
                        if (!done)
                            throw new UsersErrors_1.UserNotAllowedError();
                        return [2, null];
                }
            });
        });
    };
    return AddressesServices;
}());
exports.AddressesServices = AddressesServices;
//# sourceMappingURL=Addresses_Services.js.map