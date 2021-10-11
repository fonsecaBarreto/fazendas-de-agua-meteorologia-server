"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var address_factories_1 = require("../factories/address-factories");
var create = address_factories_1.controllers.create, update = address_factories_1.controllers.update, find = address_factories_1.controllers.find, remove = address_factories_1.controllers.remove;
function default_1(app) {
    var router = (0, express_1.Router)();
    app.use('/addresses', router);
    router.route("/")
        .get(find.execute())
        .post(create.execute());
    router.route("/:id")
        .get(find.execute())
        .put(update.execute())
        .delete(remove.execute());
}
exports.default = default_1;
//# sourceMappingURL=addresses-routes.js.map