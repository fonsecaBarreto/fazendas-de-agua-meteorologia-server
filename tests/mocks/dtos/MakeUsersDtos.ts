import { Users_Http_Dtos } from "../../../src/presentation/Models/Schemas/UsersSchemas"

export const MakeCreateUserBodyDto= (params?: Partial<Users_Http_Dtos.Create_User_Http_Body_Dto>): Users_Http_Dtos.Create_User_Http_Body_Dto =>{
     return ({
          name: "Mario",
          username: "usuario",
          role: 0,
          password: "123456",
          ...params
     })
}

export const MakeUpdateUserBodyDto= (params?: Partial<Users_Http_Dtos.Update_User_Http_Body_Dto>): Users_Http_Dtos.Update_User_Http_Body_Dto =>{
     return ({
          name: "Mario",
          username: "usuario",
          ...params
     })
}



