"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignIn_BodySchema = void 0;
var SchemaBuilder_1 = require("../../../libs/ApplicatonSchema/SchemaBuilder");
exports.SignIn_BodySchema = SchemaBuilder_1.SchemaBuilder.create(function (s) {
    s.string("username").description("Nome de Usuario");
    s.string("password").description("Senha");
});
//# sourceMappingURL=LoginSchema.js.map