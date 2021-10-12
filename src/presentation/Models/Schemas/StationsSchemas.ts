import { AppSchema, AppSchemaTools, SchemaBuilder } from "../../../libs/ApplicatonSchema/SchemaBuilder";

export const Station_CreateBodySchema: AppSchema.Schema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
     s.string("description").description("Descrição")
     s.number("longitude").description("Bairro")
     s.number("latitude").description("Numero")
     s.number("altitude").description("UF")
     s.uuid("address_id").description("Referencia ao Endereço")
});

export const Station_UpdateBodySchema: AppSchema.Schema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
     s.string("description").description("Descrição")
     s.number("longitude").description("Bairro")
     s.number("latitude").description("Numero")
     s.number("altitude").description("UF")
});
   
   
export const Station_RequiredIdParams = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
     s.uuid("id").description("Identificação")
});

export const Station_OptionalIdParams = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
     s.uuid("id").description("Identificação").optional()
});

   
   
   