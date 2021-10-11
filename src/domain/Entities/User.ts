import { BaseEntity } from "./BaseEntity"
import { Station } from "./Station"

export enum UsersRole{
     Basic, 
     Admin
}

export interface User extends BaseEntity{
     name: string;
     username: string;
     password: string;
     role: UsersRole
}

