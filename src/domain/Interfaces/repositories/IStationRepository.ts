import { Measurement } from '../../Entities/Measurements';
import { Station } from '../../Entities/Station';
import { StationMeasurementsFeed, StationView } from '../../Views/StationView';
import { IBaseRepository } from './IBaseRepository'

export interface IStationRepository extends  IBaseRepository<Station>{ 
     findStation(id:String): Promise<StationView>
     findMeasurements(id:string, offset:number, limit: number): Promise<StationMeasurementsFeed>
     findWithAddress_id(station_id: string, address_id:string): Promise<Station>
}