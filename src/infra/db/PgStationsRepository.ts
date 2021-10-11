import { Knex } from "knex";
import { Station } from "../../domain/Entities/Station";
import { IStationRepository } from "../../domain/Interfaces/repositories/IStationRepository";

import KnexAdapter from './KnexAdapter';

export class PgStationsRepository implements IStationRepository{

     async list(): Promise<Station[]> {
          const stations = await KnexAdapter.connection('stations')
          return stations;
     }

     async find(id: string): Promise<Station> {
          const query = KnexAdapter.connection('stations').where({id}).first()
          const station = await query
          return station;
     }

     async add(model: Station): Promise<void> {

          const { id, address_id , latitude, longitude, description, altitude } = model

          await KnexAdapter.connection('stations').insert({ id, latitude, longitude, description, altitude, address_id  })

          return 
     }

     async update(model: Station): Promise<void> {

          const { id, latitude, longitude,  altitude, description } = model

          await KnexAdapter.connection('Stations').where({id}).update({
               latitude, longitude,  altitude, description
          })

          return
     }

}