"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address_RemoveParamsSchema = exports.Address_ParamsSchema = exports.Address_BodySchema = void 0;
var SchemaBuilder_1 = require("../../../libs/ApplicatonSchema/SchemaBuilder");
exports.Address_BodySchema = SchemaBuilder_1.SchemaBuilder.create(function (s) {
    s.string("street").description("Logradouro");
    s.string("region").description("Bairro");
    s.string("number").description("Numero");
    s.string("uf").description("UF");
    s.string("city").description("Cidade");
    s.string("details").description("Complementos").optional();
    s.cep("postalCode").description('Cep');
});
exports.Address_ParamsSchema = SchemaBuilder_1.SchemaBuilder.create(function (s) {
    s.uuid("id").description("Identificação").optional();
});
exports.Address_RemoveParamsSchema = SchemaBuilder_1.SchemaBuilder.create(function (s) {
    s.uuid("id").description("Identificação");
});
//# sourceMappingURL=AddressSchemas.js.map