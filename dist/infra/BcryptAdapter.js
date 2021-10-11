"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptAdapter = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var BcryptAdapter = (function () {
    function BcryptAdapter() {
    }
    BcryptAdapter.prototype.hash = function (value) {
        return bcrypt_1.default.hashSync(value, 12);
    };
    BcryptAdapter.prototype.compare = function (value, hash) {
        return bcrypt_1.default.compareSync(value, hash);
    };
    return BcryptAdapter;
}());
exports.BcryptAdapter = BcryptAdapter;
//# sourceMappingURL=BcryptAdapter.js.map