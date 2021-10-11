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
exports.AuthenticationServices = void 0;
var AuthenticationServices = (function () {
    function AuthenticationServices(_usersRepository, _hasher, _encrypter) {
        this._usersRepository = _usersRepository;
        this._hasher = _hasher;
        this._encrypter = _encrypter;
    }
    AuthenticationServices.prototype.generateToken = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var username, password, userExists, passwordIsCorrect, payload, token, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = params.username, password = params.password;
                        return [4, this._usersRepository.findByUsername(username)];
                    case 1:
                        userExists = _a.sent();
                        if (!userExists)
                            return [2, null];
                        return [4, this._hasher.compare(password, userExists.password)];
                    case 2:
                        passwordIsCorrect = _a.sent();
                        if (!passwordIsCorrect)
                            return [2, null];
                        payload = { id: userExists.id, username: username };
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4, this._encrypter.sign(payload)];
                    case 4:
                        token = _a.sent();
                        return [2, token];
                    case 5:
                        err_1 = _a.sent();
                        return [2, null];
                    case 6: return [2];
                }
            });
        });
    };
    AuthenticationServices.prototype.verifyToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, err_2, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this._encrypter.verify(token)];
                    case 1:
                        decoded = _a.sent();
                        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                            return [2, null];
                        return [3, 3];
                    case 2:
                        err_2 = _a.sent();
                        return [2, null];
                    case 3: return [4, this._usersRepository.find(decoded.id)];
                    case 4:
                        user = _a.sent();
                        return [2, user];
                }
            });
        });
    };
    return AuthenticationServices;
}());
exports.AuthenticationServices = AuthenticationServices;
//# sourceMappingURL=Authentication_Services.js.map