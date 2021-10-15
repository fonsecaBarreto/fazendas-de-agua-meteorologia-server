import SchemaBd, { SchemaBuilder } from '../../../libs/ApplicatonSchema/SchemaBuilder'

export const Address_BodySchema = SchemaBd.create( (s: SchemaBuilder)=> {
  s.string("street").description("Logradouro")
  s.string("region").description("Bairro")
  s.string("number").description("Numero")
  s.string("uf").description("UF")
  s.string("city").description("Cidade")
  s.string("details").description("Complementos").optional()
  s.cep("postalCode").description('Cep')
});


export const Address_ParamsSchema = SchemaBd.create( (s:SchemaBuilder )=> {
  s.uuid("id").description("Identificação").optional()
});


export const Address_RemoveParamsSchema = SchemaBd.create( (s: SchemaBuilder )=> {
  s.uuid("id").description("Identificação")
});



