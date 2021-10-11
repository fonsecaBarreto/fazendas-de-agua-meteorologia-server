"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = exports.addressServices = exports.createUsersServices = void 0;
var Users_Controllers_1 = require("../../../presentation/Controllers/V1/Users.Controllers");
var Users_Services_1 = require("../../../domain/Services/Users/Users_Services");
var Addresses_Services_1 = require("../../../domain/Services/Addresses/Addresses_Services");
var db_1 = require("../../../infra/db");
var infra_1 = require("../../../infra");
var usersRepository = new db_1.PgUsersRepository();
var addressRepository = new db_1.PgAddressesRepository();
var hasher = new infra_1.BcryptAdapter();
var idGenerator = new infra_1.UuidAdapter();
exports.createUsersServices = new Users_Services_1.UsersServices(usersRepository, idGenerator, hasher);
exports.addressServices = new Addresses_Services_1.AddressesServices(addressRepository, usersRepository, idGenerator);
exports.controllers = {
    create: new Users_Controllers_1.CreateUserController(exports.createUsersServices, exports.addressServices)
};
//# sourceMappingURL=users-factories.js.map