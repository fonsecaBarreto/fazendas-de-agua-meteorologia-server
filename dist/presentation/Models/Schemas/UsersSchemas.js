"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdOptional_ParamsSchema = exports.UserId_ParamsSchema = exports.UpdateUser_BodySchema = exports.CreateUser_BodySchema = void 0;
var SchemaBuilder_1 = require("../../../libs/ApplicatonSchema/SchemaBuilder");
exports.CreateUser_BodySchema = SchemaBuilder_1.SchemaBuilder.create(function (s) {
    s.string("name").description("Nome do usuario");
    s.string("username").description("Nome de Usuario");
    s.string("password").description("Senha");
    s.number("role").description("Tipo do usuario");
    s.number("address_id").description("Endereço de Usuario").optional();
});
exports.UpdateUser_BodySchema = SchemaBuilder_1.SchemaBuilder.create(function (s) {
    s.string("name").description("Nome do usuario");
    s.string("username").description("Nome de Usuario");
});
exports.UserId_ParamsSchema = SchemaBuilder_1.SchemaBuilder.create(function (s) {
    s.uuid("id").description("Id de usuario");
});
exports.UserIdOptional_ParamsSchema = SchemaBuilder_1.SchemaBuilder.create(function (s) {
    s.uuid("id").description("Id de usuario").optional();
});
//# sourceMappingURL=UsersSchemas.js.map