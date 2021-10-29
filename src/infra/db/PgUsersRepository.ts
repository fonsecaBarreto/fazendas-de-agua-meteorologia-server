import { User } from "../../domain/Entities/User";
import { IUserRepository } from "../../domain/Interfaces/repositories/IUserRepository";
import { UserView } from "../../domain/Views/UserView";
import KnexAdapter from './KnexAdapter';
import { PgBaseRepository } from "./PgBaseRepository";

export class PgUsersRepository extends PgBaseRepository<User> implements IUserRepository {
     constructor( ){super("users")}

     async findUser(id: string): Promise<UserView> {

          const resultado: any = await KnexAdapter.connection('users')
               .select([
                    "users.*", 
                    KnexAdapter.connection.raw("COALESCE (json_agg( add.* ) FILTER (WHERE add IS NOT NULL), '[]')  as address")
               ])
               .leftJoin('users_addresses AS ua', 'ua.user_id', "=", "users.id")
               .leftJoin('addresses AS add', 'ua.address_id', "=", "add.id")
               .groupBy("users.id")
               .where({'users.id':id})
               .first()

          if(!resultado) return null

          const address = resultado.address.length > 0 ? resultado.address[0] : null
          delete resultado.address

          return new UserView(resultado, address)

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

