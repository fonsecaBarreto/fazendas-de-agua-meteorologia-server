import { MeasurementMetrics } from '@/domain/Views';
import { Measurement } from '../../Entities/Measurements';
import { Station } from '../../Entities/Station';
import { SMPageFeed, StationView } from '../../Views/StationView';
import { IBaseRepository } from './IBaseRepository'

export interface IStationRepository extends  IBaseRepository<Station>{ 
     findStation(id:String): Promise<StationView>
     findWithAddress_id(station_id: string, address_id:string): Promise<Station>
     findMeasurements(id:string, offset:number, limit: number): Promise<SMPageFeed>

     findMeasurementsByInterval(station_id:string, start_date: Date, end_date: Date): Promise<MeasurementMetrics> //scales refer to minutes between data
}