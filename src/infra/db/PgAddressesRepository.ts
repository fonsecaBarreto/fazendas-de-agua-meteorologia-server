import { Address } from "../../domain/Entities/Address";
import { IAddressRepository } from "../../domain/Interfaces/repositories/IAddressRepository";
import { PgBaseRepository } from "./PgBaseRepository";
import KnexAdapter from './KnexAdapter'

export class PgAddressesRepository extends PgBaseRepository<Address> implements IAddressRepository{
     constructor() { super("addresses") }

     async relateUser(user_id: string, address_id: string): Promise<boolean> {
          const exists = await KnexAdapter.connection('users_addresses').where({user_id, address_id}).first()
          if(exists) return false

          await KnexAdapter.connection('users_addresses').insert({user_id, address_id})
          return true
     }

     async upsert(model:Address): Promise<void> {
          await this._upsert( model, ['street','region','uf','number','city','details', 'postalCode','updated_at'])
          return 
     }

}