import SchemaBd, { SchemaBuilder } from '../../../libs/ApplicatonSchema/SchemaBuilder'

export const Station_CreateBodySchema: SchemaBuilder.Schema = SchemaBd.create( (s: SchemaBuilder )=> {
     s.string("description").description("Descrição")
     s.number("longitude").description("Bairro")
     s.number("latitude").description("Numero")
     s.number("altitude").description("UF")
     s.uuid("address_id").description("Referencia ao Endereço")
});

export const Station_UpdateBodySchema: SchemaBuilder.Schema = SchemaBd.create( (s: SchemaBuilder )=> {
     s.string("description").description("Descrição")
     s.number("longitude").description("Bairro")
     s.number("latitude").description("Numero")
     s.number("altitude").description("UF")
});
   
export const Station_RequiredIdParams = SchemaBd.create( (s: SchemaBuilder)=> {
     s.uuid("id").description("Identificação")
});

export const Station_OptionalIdParams = SchemaBd.create( (s: SchemaBuilder )=> {
     s.uuid("id").description("Identificação").optional()
});

   
   
   