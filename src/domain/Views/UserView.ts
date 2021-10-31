import { Address } from "../Entities/Address";
import { User, UsersRole } from "../Entities/User";

export class UserView implements Omit<User, 'password'>{

  name: string;
  username: string;
  role: UsersRole

  /* base */
  id: string;
  created_at?: Date;
  updated_at?: Date;
  //Relation
  address: Address

  constructor(user: User, add: Address = null){
    const params = { ...user }
    if(params.password){  delete params.password  }
    Object.assign(this,{...params})
    this.address = add
  }

  setAddress(add: Address){
    this.address = add
  }
}

