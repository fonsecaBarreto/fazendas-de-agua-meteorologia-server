import { Measurement } from "../../domain/Entities/Measurements";
import { Station } from "../../domain/Entities/Station";
import { IStationRepository } from "../../domain/Interfaces/repositories/IStationRepository";
import { StationMeasurementsFeed, StationView } from "../../domain/Views/StationView";
import KnexAdapter from "./KnexAdapter";

import { PgBaseRepository } from "./PgBaseRepository";

export class PgStationsRepository extends PgBaseRepository<Station> implements IStationRepository {
     constructor(){
          super('stations')
     }

     async findWithAddress_id(station_id: string, address_id: string): Promise<Station> {
          const query = KnexAdapter.connection('stations').where({id: station_id, address_id}).first()
          const address = await query
          return address;
     }
     async findMeasurements(station_id: string, offset: number, limit: number): Promise<StationMeasurementsFeed> {
        
          const { count } = await KnexAdapter.connection('measurements').where({station_id}).count('id', { as: 'count' }).first();
        
          const measurements: any = await KnexAdapter.connection('measurements').where({station_id})
               .orderBy('created_at','asc').limit(limit).offset(offset)

          if(!measurements || measurements.length == 0) return null
     
          return ({
               total: Number(count),
               page_index: Math.ceil(offset / limit),
               page_limit: limit,
               data: measurements
          })
     }

     async findStation(id:string): Promise<StationView>{

          const resultado: any = await KnexAdapter.connection('stations')
          .select(["stations.*", KnexAdapter.connection.raw("JSON_AGG( add.*) as address") ])
          .leftJoin('addresses AS add', 'add.id', "=", "stations.address_id")
          .groupBy("stations.id")
          .where({'stations.id': id})
          .first();

          if(!resultado) return null

          const address = ( resultado?.address ) ?  resultado.address[0] : null

          delete resultado.address

          return new StationView(resultado, address);
     }
     async upsert(model:Station): Promise<void> {
          await this._upsert( model, ['description','longitude','latitude','altitude'])
          return 
     }
}

