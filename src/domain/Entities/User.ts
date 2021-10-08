import { BaseEntity } from "./BaseEntity"
import { Station } from "./Station"

export enum UsersRole{
     Basic, 
     Admin,
     Station
}

export interface User extends BaseEntity{
     name: string;
     username: string;
     password: string;
     role: UsersRole
     //relations
     station?: Station
}


/* 

public get role() { return this._role; }
public get password() { return this._password; }

public setRole(value: UsersRole) {
     if (value > 1 && value < 0) 
          throw new UsersErrors("Usuario deve ter tipo 'Admin' ou 'Cliente'");
     this._role = value;
}

public setPassword(value:string, toHash: boolean = true){
     if(!value) 
          throw new UsersErrors("Informe uma Senha Valida!");
     this._password = toHash ? User.hasher.hash(value) : value;
}

constructor(id:string, name:string, phone:string, email:string, password:{ value?:string, hash?: string }, role: UsersRole, 
     address?: Address, created_at?: Date, updated_at?: Date)
{
     super({ id, created_at, updated_at })
     this.setRole(role);
     this.setPassword(password.hash || password.value, password.hash ? false : true)
     this.name = name;
     this.phone = phone;
     this.email = email;
     this.address = address;

} */