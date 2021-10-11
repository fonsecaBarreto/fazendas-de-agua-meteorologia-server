import { Address } from "../../domain/Entities/Address";
import { User } from "../../domain/Entities/User";
import { IUserRepository } from "../../domain/Interfaces/repositories/IUserRepository";
import { UserView } from "../../domain/Views/UserView";
import KnexAdapter from './KnexAdapter';
import { PgBaseRepository } from "./PgBaseRepository";

export class PgUsersRepository extends PgBaseRepository<User> implements IUserRepository {
     constructor( ){super("users")}

     async findUser(id: string): Promise<UserView> {

          const outro: any = await KnexAdapter.connection('users')
               .leftJoin('users_addresses AS ua', 'ua.user_id', "=", "users.id")
               .first()
               .where({id:id})
               .select()
          if(!outro) return null

          const view = new UserView(outro)
          if(outro.address_id){
               const address: Address = await KnexAdapter.connection('addresses').where({id: outro.address_id}).first()
               view.setAddress(address)
          }
          return view
     }

     async upsert(model: User): Promise<void> {
          await this._upsert( model, ['username', 'name', 'updated_at'])
          return 
     }

     async findByUsername(username: string): Promise<User> {
          const user = await KnexAdapter.connection("users").where({username}).first();
          return user;
     }

}

 /*  KnexAdapter.connection.raw("json_agg( ua.address_id) as address") */