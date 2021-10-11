import { Address } from '../../Entities/Address';
import { Station } from '../../Entities/Station';
import { IBaseRepository } from './IBaseRepository'

export interface IStationRepository{ 
     add(model:Station): Promise<void>
     find(id:string): Promise<Station>
     list(): Promise<Station[]>
     update(model:Station): Promise<void>
}