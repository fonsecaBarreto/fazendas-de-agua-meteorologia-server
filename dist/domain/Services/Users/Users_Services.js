"use strict";
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
exports.UsersServices = void 0;
var User_1 = require("../../Entities/User");
var UsersErrors_1 = require("../../Errors/UsersErrors");
var UserView_1 = require("../../Views/UserView");
var rolesList = Object.values(User_1.UsersRole).filter(function (value) { return isNaN(Number(value)) === false; });
var UsersServices = (function () {
    function UsersServices(_usersRepository, _idGenerator, _hasher) {
        this._usersRepository = _usersRepository;
        this._idGenerator = _idGenerator;
        this._hasher = _hasher;
    }
    UsersServices.prototype.isUserAvailable = function (username, id) {
        return __awaiter(this, void 0, void 0, function () {
            var userNameInUse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._usersRepository.findByUsername(username)];
                    case 1:
                        userNameInUse = _a.sent();
                        if (userNameInUse && userNameInUse.id !== id)
                            throw new UsersErrors_1.UserNameInUseError();
                        return [2, true];
                }
            });
        });
    };
    UsersServices.prototype.create = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var name, username, password, role, id, hashed_password, user, userView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = params.name, username = params.username, password = params.password, role = params.role;
                        if (!rolesList.includes(role))
                            throw new UsersErrors_1.UserRoleIsInvalidError();
                        return [4, this.isUserAvailable(username)];
                    case 1:
                        _a.sent();
                        id = this._idGenerator.gen();
                        hashed_password = this._hasher.hash(password);
                        user = { id: id, name: name, username: username, password: hashed_password, role: role };
                        return [4, this._usersRepository.upsert(user)];
                    case 2:
                        _a.sent();
                        userView = new UserView_1.UserView(user);
                        return [2, userView];
                }
            });
        });
    };
    UsersServices.prototype.update = function (id, params) {
        return __awaiter(this, void 0, void 0, function () {
            var name, username, user, userView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = params.name, username = params.username;
                        return [4, this._usersRepository.find(id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new UsersErrors_1.UserNotFoundError();
                        return [4, this.isUserAvailable(username, id)];
                    case 2:
                        _a.sent();
                        user.name = name;
                        user.username = username;
                        return [4, this._usersRepository.upsert(user)];
                    case 3:
                        _a.sent();
                        userView = new UserView_1.UserView(user);
                        return [2, userView];
                }
            });
        });
    };
    UsersServices.prototype.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._usersRepository.find(id)];
                    case 1:
                        user = _a.sent();
                        return [2, user ? new UserView_1.UserView(user) : null];
                }
            });
        });
    };
    UsersServices.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._usersRepository.list()];
                    case 1:
                        users = _a.sent();
                        return [2, users.length > 0 ? users : []];
                }
            });
        });
    };
    UsersServices.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var wasDeleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._usersRepository.remove(id)];
                    case 1:
                        wasDeleted = _a.sent();
                        if (!wasDeleted)
                            throw new UsersErrors_1.UserNotFoundError();
                        return [2];
                }
            });
        });
    };
    return UsersServices;
}());
exports.UsersServices = UsersServices;
//# sourceMappingURL=Users_Services.js.map