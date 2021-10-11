import { SchemaBuilder, AppSchemaTools } from '../../../libs/ApplicatonSchema/SchemaBuilder'

export const Address_BodySchema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
  s.string("street").description("Logradouro")
  s.string("region").description("Bairro")
  s.string("number").description("Numero")
  s.string("uf").description("UF")
  s.string("city").description("Cidade")
  s.string("details").description("Complementos").optional()
  s.cep("postalCode").description('Cep')
});


export const Address_ParamsSchema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
  s.uuid("id").description("Identificação").optional()
});


export const Address_RemoveParamsSchema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
  s.uuid("id").description("Identificação")
});



