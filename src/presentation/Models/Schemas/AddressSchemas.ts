import { IAddressesServices } from '../../../domain/Services/Addresses/Addresses_Services';
import SchemaBd, { SchemaBuilder } from '../../../libs/ApplicatonSchema/SchemaBuilder'

export namespace Address_Http_Dtos {
  
  export const Create_Address_Schema = SchemaBd.create( (s: SchemaBuilder)=> {
    s.string("street").description("Logradouro")
    s.string("region").description("Bairro")
    s.string("number").description("Numero")
    s.string("uf").description("UF")
    s.string("city").description("Cidade")
    s.string("details").description("Complementos").optional()
    s.cep("postalCode").description('Cep')
  });
  
  export interface Create_Address_Http_Body_Dto extends IAddressesServices.Params.Create {}

  export const Address_Params_Schema = SchemaBd.create( (s: SchemaBuilder )=> {
    s.uuid("id").description("ID do Endereço")
  });
  
  export interface Address_Http_Param_Dto { id: string }

}





