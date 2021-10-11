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
exports.BasicUserView = exports.AdminUserView = exports.UserView = void 0;
var UserView = (function () {
    function UserView(params) {
        this.id = params.id;
        this.name = params.name;
        this.username = params.username;
        this.role = params.role;
        this.created_at = params.created_at;
        this.updated_at = params.updated_at;
    }
    return UserView;
}());
exports.UserView = UserView;
var AdminUserView = (function (_super) {
    __extends(AdminUserView, _super);
    function AdminUserView(params) {
        return _super.call(this, params) || this;
    }
    return AdminUserView;
}(UserView));
exports.AdminUserView = AdminUserView;
var BasicUserView = (function (_super) {
    __extends(BasicUserView, _super);
    function BasicUserView(params) {
        return _super.call(this, params) || this;
    }
    BasicUserView.prototype.setAddress = function (addresses) {
        this.addresses = addresses;
    };
    return BasicUserView;
}(UserView));
exports.BasicUserView = BasicUserView;
//# sourceMappingURL=UserView.js.map