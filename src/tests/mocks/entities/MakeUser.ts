import { User, UsersRole } from "../../../domain/Entities/User"
import faker from 'faker'
import { v4 } from "uuid"
import { MakeFakeStation } from "./MakeStation"
import { hashSync } from 'bcrypt'

export const MakeFakeUser = ( params?: Partial<User>): User =>{

     return {
          id: v4(),
          name: "Nome Teste",
          password: hashSync("123456",12),
          role: UsersRole.Basic,
          username: "username teste",
          ...params
     }
  
}