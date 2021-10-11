"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var login_factories_1 = require("../factories/login-factories");
var signIn = login_factories_1.controllers.signIn, auth = login_factories_1.controllers.auth;
function default_1(app) {
    var router = (0, express_1.Router)();
    app.use('/login', router);
    router.post('/signin', signIn.execute());
    router.post('/auth', auth.execute());
}
exports.default = default_1;
//# sourceMappingURL=login-routes.js.map