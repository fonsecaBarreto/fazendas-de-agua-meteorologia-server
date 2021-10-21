import { Station } from "../../domain/Entities/Station";
import { IStationRepository } from "../../domain/Interfaces/repositories/IStationRepository";
import { StationView } from "../../domain/Views/StationView";
import KnexAdapter from "./KnexAdapter";

import { PgBaseRepository } from "./PgBaseRepository";

export class PgStationsRepository extends PgBaseRepository<Station> implements IStationRepository {
     constructor(){
          super('stations')
     }

     async findStation(id:string): Promise<StationView>{
          const resultado: any = await KnexAdapter.connection('stations')
          .select(["stations.*", KnexAdapter.connection.raw("JSON_AGG( add.*) as address")])
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

