import { BaseEntity } from "./BaseEntity"
import { Station } from "./Station"

export enum UsersRole{
     Basic = 0,
     Admin = 1
}

export interface User extends BaseEntity{
     name: string;
     username: string;
     password: string;
     role: UsersRole
}

