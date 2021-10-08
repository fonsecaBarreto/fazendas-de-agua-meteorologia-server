import { Knex } from "knex";
import { User, UsersRole } from "../../domain/Entities/User";
import { IUserRepository } from "../../domain/Interfaces/repositories/IUserRepository";
import KnexAdapter from './KnexAdapter';

export interface UserData extends Omit<User,'station'> {}


export class PgUsersRepository implements IUserRepository{
     
     async findByUsername(username: string): Promise<User> {
          const user = await KnexAdapter.connection("users").where({username}).first();
          return user;
     }

     async find(id: string): Promise<User> {
          const query = KnexAdapter.connection('users').where({id}).first()
          const user = await query
          return user;
     }

     async add(model: User): Promise<void> {

          const { id, name, username, password, role, station } = model

          await KnexAdapter.connection('users').insert({
               id, name, username, password, role
          })

         /*  if(station){
               const { address_id, altitude, description,  latitude, longitude } = station

               await KnexAdapter.getConnection("stations").insert({
                    id: station.id, address_id, altitude, description,  latitude, longitude 
               })

               await KnexAdapter.getConnection('users_stations').insert({
                    user_id: id, station_id: station.id
               })
          } */
          return 
     }
     async list(): Promise<User[]> {
          const users = await KnexAdapter.connection('users')
          return users;
     }
  
    async remove(id: string): Promise<boolean> {
          await KnexAdapter.connection('users').del()
          return true;
     }
     
     async update(model: User): Promise<void> {

          const { id, name, username, password, role, station } = model

          await KnexAdapter.connection('users').where({id}).update({
               name, username, password, role
          })

          return
     }

}