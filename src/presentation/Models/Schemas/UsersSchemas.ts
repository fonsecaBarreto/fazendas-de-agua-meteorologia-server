import { IUsersServices } from '@/domain/Services/Users/Users_Services';
import SchemaBd, { SchemaBuilder } from '../../../libs/ApplicatonSchema/SchemaBuilder'

export namespace Users_Http_Dtos {

     export const Create_User_Schema = SchemaBd.create( (s: SchemaBuilder )=> {
          s.string("name").description("Nome do usuario")
          s.string("username").description("Nome de Usuario")
          s.string("password").description("Senha")
          s.number("role").description("Tipo do usuario")
          s.uuid("address_id").description("Endereço de Usuario").optional()
     });
     export interface Create_User_Http_Body_Dto extends IUsersServices.Params.Create {}

     export const Update_User_Schema = SchemaBd.create( (s: SchemaBuilder )=> {
          s.string("name").description("Nome do usuario")
          s.string("username").description("Nome de Usuario")
     });
     export interface Update_User_Http_Body_Dto { name:string, username:string }

     export const User_Params_Schema = SchemaBd.create( (s: SchemaBuilder )=> {
          s.uuid("id").description("Id de usuario")
     });
     
     export const User_Optional_Params_Schema = SchemaBd.create( (s: SchemaBuilder )=> {
          s.uuid("id").description("Id de usuario").optional()
     });
     
}

