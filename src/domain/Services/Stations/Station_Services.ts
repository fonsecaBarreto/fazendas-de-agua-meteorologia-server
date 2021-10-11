import { Station } from "../../Entities/Station";
import { IStationRepository } from "../../Interfaces/repositories/IStationRepository";

export class StationsServices {
     constructor(
          private readonly _stationsRepository: IStationRepository
     ){}
     async find(id:string): Promise<Station>{
          const station: Station = await this._stationsRepository.find(id)
          return station ? station : null
     }

     async list(): Promise<Station[]>{
          const stations: Station[] = await this._stationsRepository.list()
          return stations.length > 0 ? stations : [];
     }
}