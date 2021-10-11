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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotAllowedError = exports.UserNameInUseError = exports.UserNotFoundError = exports.UserRoleIsInvalidError = void 0;
var UserRoleIsInvalidError = (function (_super) {
    __extends(UserRoleIsInvalidError, _super);
    function UserRoleIsInvalidError() {
        var _this = _super.call(this, "Tipo de usuário desconhecido") || this;
        Object.setPrototypeOf(_this, UserRoleIsInvalidError.prototype);
        return _this;
    }
    return UserRoleIsInvalidError;
}(Error));
exports.UserRoleIsInvalidError = UserRoleIsInvalidError;
var UserNotFoundError = (function (_super) {
    __extends(UserNotFoundError, _super);
    function UserNotFoundError() {
        var _this = _super.call(this, "Usuario nao encontrado.") || this;
        Object.setPrototypeOf(_this, UserNotFoundError.prototype);
        return _this;
    }
    return UserNotFoundError;
}(Error));
exports.UserNotFoundError = UserNotFoundError;
var UserNameInUseError = (function (_super) {
    __extends(UserNameInUseError, _super);
    function UserNameInUseError() {
        var _this = _super.call(this, "J\u00E1 existe um usuario para esse Nome de Usuario") || this;
        Object.setPrototypeOf(_this, UserNameInUseError.prototype);
        return _this;
    }
    return UserNameInUseError;
}(Error));
exports.UserNameInUseError = UserNameInUseError;
var UserNotAllowedError = (function (_super) {
    __extends(UserNotAllowedError, _super);
    function UserNotAllowedError() {
        var _this = _super.call(this, "Operação negada.") || this;
        Object.setPrototypeOf(_this, UserNotAllowedError.prototype);
        return _this;
    }
    return UserNotAllowedError;
}(Error));
exports.UserNotAllowedError = UserNotAllowedError;
//# sourceMappingURL=UsersErrors.js.map