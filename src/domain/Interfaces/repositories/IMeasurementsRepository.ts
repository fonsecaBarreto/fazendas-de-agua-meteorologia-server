import { Measurement } from '../../Entities/Measurements';

export interface IMeasurementsRepository {
     find(id:string): Promise<Measurement>
     add(entity:Measurement): Promise<void>
     remove(id:string): Promise<boolean>
     findByDate(station_id:string, created_at: Date): Promise<Measurement>
}
