import { SchemaBuilder, AppSchemaTools } from '../../../libs/ApplicatonSchema/SchemaBuilder'


export const CreateUser_BodySchema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
     s.string("name").description("Nome do usuario")
     s.string("username").description("Nome de Usuario")
     s.string("password").description("Senha")
     s.number("role").description("Tipo do usuario")
     s.uuid("address_id").description("Endereço de Usuario").optional()
});

export const UpdateUser_BodySchema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
     s.string("name").description("Nome do usuario")
     s.string("username").description("Nome de Usuario")
});
   
export const UserId_ParamsSchema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
     s.uuid("id").description("Id de usuario")
});
   
export const UserIdOptional_ParamsSchema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
     s.uuid("id").description("Id de usuario").optional()
});
   
   