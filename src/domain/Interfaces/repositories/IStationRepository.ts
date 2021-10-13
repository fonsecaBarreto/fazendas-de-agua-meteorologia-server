import { Address } from '../../Entities/Address';
import { Station } from '../../Entities/Station';
import { IBaseRepository } from './IBaseRepository'

export interface IStationRepository extends  IBaseRepository<Station>{ }