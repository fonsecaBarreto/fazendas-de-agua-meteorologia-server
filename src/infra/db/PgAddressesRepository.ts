import { Address } from "../../domain/Entities/Address";
import { IAddressRepository } from "../../domain/Interfaces/repositories/IAddressRepository";
import { PgBaseRepository } from "./PgBaseRepository";
import KnexAdapter from './KnexAdapter'
import { AddressView } from "../../domain/Views/AddressView";
import { UserView } from "../../domain/Views/UserView";


export class PgAddressesRepository extends PgBaseRepository<Address> implements IAddressRepository{
     constructor() { super("addresses") }

     async findAddress(id: string): Promise<AddressView> {

          const resultado: any = await KnexAdapter.connection('addresses')
               .select(["addresses.*", KnexAdapter.connection.raw("COALESCE (JSON_AGG( st.* ) FILTER (WHERE st IS NOT NULL), '[]') as stations")])
               .leftJoin('stations AS st', 'addresses.id', "=", "st.address_id")
               .groupBy("addresses.id")
               .where({'addresses.id': id})
               .first();

          if(!resultado) return null

          const stations = resultado.stations
          delete resultado.stations

          return new AddressView(resultado, stations);
     }

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