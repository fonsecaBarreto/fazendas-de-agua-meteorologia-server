import { Measurements } from '../../Entities/Measurements';
import { IBaseRepository } from './IBaseRepository'


export interface IMeasurementsRepository extends Omit<IBaseRepository<Measurements>,'list'> {}
