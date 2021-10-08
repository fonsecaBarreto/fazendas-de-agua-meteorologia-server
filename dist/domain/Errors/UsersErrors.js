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
exports.UserInUseError = exports.UserNotFoundError = exports.UsersErrors = void 0;
var UsersErrors = (function (_super) {
    __extends(UsersErrors, _super);
    function UsersErrors(msg) {
        return _super.call(this, msg) || this;
    }
    return UsersErrors;
}(Error));
exports.UsersErrors = UsersErrors;
var UserNotFoundError = (function (_super) {
    __extends(UserNotFoundError, _super);
    function UserNotFoundError() {
        return _super.call(this, "Usuario nao encontrado.") || this;
    }
    return UserNotFoundError;
}(UsersErrors));
exports.UserNotFoundError = UserNotFoundError;
var UserInUseError = (function (_super) {
    __extends(UserInUseError, _super);
    function UserInUseError() {
        return _super.call(this, "J\u00E1 existe um usuario para esse E-mail ou numero de telefone") || this;
    }
    return UserInUseError;
}(UsersErrors));
exports.UserInUseError = UserInUseError;
//# sourceMappingURL=UsersErrors.js.map