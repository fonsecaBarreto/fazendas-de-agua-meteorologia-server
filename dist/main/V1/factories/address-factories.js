"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = void 0;
var Addresses_Controller_1 = require("../../../presentation/Controllers/V1/Addresses.Controller");
var Addresses_Services_1 = require("../../../domain/Services/Addresses/Addresses_Services");
var infra_1 = require("../../../infra");
var PgAddressesRepository_1 = require("../../../infra/db/PgAddressesRepository");
var db_1 = require("../../../infra/db");
var idGenerator = new infra_1.UuidAdapter();
var addressesRepository = new PgAddressesRepository_1.PgAddressesRepository();
var usersRepository = new db_1.PgUsersRepository();
var services = new Addresses_Services_1.AddressesServices(addressesRepository, usersRepository, idGenerator);
exports.controllers = {
    create: new Addresses_Controller_1.CreateAddressController(services),
    update: new Addresses_Controller_1.UpdateAddressController(services),
    find: new Addresses_Controller_1.FindAddresController(services),
    remove: new Addresses_Controller_1.RemoveAddresController(services)
};
//# sourceMappingURL=address-factories.js.map