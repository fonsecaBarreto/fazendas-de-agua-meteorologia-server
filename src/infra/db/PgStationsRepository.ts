import { Station } from "../../domain/Entities/Station";
import { IStationRepository } from "../../domain/Interfaces/repositories/IStationRepository";

import { PgBaseRepository } from "./PgBaseRepository";

export class PgStationsRepository extends PgBaseRepository<Station> implements IStationRepository {

     async upsert(model:Station): Promise<void> {
          await this._upsert( model, ['description','longitude','latitude','altitude'])
          return 
     }
}

