import { Knex } from "knex";
import { Measurement } from "../../domain/Entities/Measurements";
import { IMeasurementsRepository } from "../../domain/Interfaces";
import KnexAdapter from './KnexAdapter'

export class PgMeasurementsRepository implements IMeasurementsRepository{

     private readonly table = 'measurements'
     async findByDate(station_id: string, created_at: Date): Promise<Measurement> {
         const measurement = await KnexAdapter.connection(this.table).where({station_id, created_at}).first();
          return measurement
     }
     async find(id: string): Promise<Measurement> {
          const measurement = await KnexAdapter.connection(this.table).where({id}).first();
          return measurement
     }
     async add(measurement: Measurement): Promise<void> {
          await KnexAdapter.connection(this.table).insert(measurement)
          return
     }

     async remove(id: string): Promise<boolean> {
          const rows = await KnexAdapter.connection(this.table).where({id}).delete();
          return (rows > 0 ) ? true : false 
     }

}