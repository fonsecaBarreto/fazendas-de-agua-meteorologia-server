import { Measurement } from '../../Entities/Measurements';
import { Station } from '../../Entities/Station';
import { StationView } from '../../Views/StationView';
import { IBaseRepository } from './IBaseRepository'

export interface IStationRepository extends  IBaseRepository<Station>{ 
     findStation(id:String): Promise<StationView>
     findMeasurements(id:string, offset:number, limit: number): Promise<Measurement[]>
}