"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = exports.authenticationServices = void 0;
var Login_Controllers_1 = require("../../../presentation/Controllers/V1/Login.Controllers");
var Authentication_Services_1 = require("../../../domain/Services/Users/Authentication_Services");
var infra_1 = require("../../../infra");
var db_1 = require("../../../infra/db");
var usersRepository = new db_1.PgUsersRepository();
var encryper = new infra_1.JsonWebTokenAdapter("secret");
var hasher = new infra_1.BcryptAdapter();
exports.authenticationServices = new Authentication_Services_1.AuthenticationServices(usersRepository, hasher, encryper);
exports.controllers = {
    signIn: new Login_Controllers_1.SignInUserController(exports.authenticationServices),
    auth: new Login_Controllers_1.AuthUserController(),
};
//# sourceMappingURL=login-factories.js.map