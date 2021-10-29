import { Measurement } from '../../Entities/Measurements';
import { Station } from '../../Entities/Station';
import { SMPageFeed, SMTimeIntervalFeed, StationView } from '../../Views/StationView';
import { IBaseRepository } from './IBaseRepository'

export interface IStationRepository extends  IBaseRepository<Station>{ 
     findStation(id:String): Promise<StationView>
     findMeasurements(id:string, offset:number, limit: number): Promise<SMPageFeed>
     findMeasurementsByInterval(id:string, start_date: Date, end_date: Date): Promise<SMTimeIntervalFeed>
     findWithAddress_id(station_id: string, address_id:string): Promise<Station>
}