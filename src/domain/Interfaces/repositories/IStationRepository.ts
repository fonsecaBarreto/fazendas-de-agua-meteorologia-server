import { Address } from '../../Entities/Address';
import { Station } from '../../Entities/Station';
import { StationView } from '../../Views/StationView';
import { IBaseRepository } from './IBaseRepository'

export interface IStationRepository extends  IBaseRepository<Station>{ 
     findStation(id:String): Promise<StationView>
}