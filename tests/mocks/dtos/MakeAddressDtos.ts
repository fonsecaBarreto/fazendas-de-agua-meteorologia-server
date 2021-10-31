import { Address_Http_Dtos } from "../../../src/presentation/Models/Schemas/AddressSchemas"

export const MakeAddressBodyDto= (params?: Partial<Address_Http_Dtos.Create_Address_Http_Body_Dto>): Address_Http_Dtos.Create_Address_Http_Body_Dto =>{
     return ({
          city:"Cidade Teste",
          details:"Complemento teste",
          number: "123",
          uf:"RJ",
          postalCode:"00000000",
          region: "Bairro das Flores",
          street: "Rua Nossa Senhora",
          ...params
     })
}
