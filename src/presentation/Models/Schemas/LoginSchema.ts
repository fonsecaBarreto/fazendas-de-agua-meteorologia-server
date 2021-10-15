import SchemaBd, { SchemaBuilder } from '../../../libs/ApplicatonSchema/SchemaBuilder'

export const SignIn_BodySchema = SchemaBd.create( (s: SchemaBuilder )=> {
  s.string("username").description("Nome de Usuario")
  s.string("password").description("Senha")
});

