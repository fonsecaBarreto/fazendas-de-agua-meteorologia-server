import { SchemaBuilder, AppSchemaTools } from '../../../libs/ApplicatonSchema/SchemaBuilder'

export const SignIn_BodySchema = SchemaBuilder.create( (s: AppSchemaTools.IBuilder )=> {
  s.string("username").description("Nome de Usuario")
  s.string("password").description("Senha")
});

