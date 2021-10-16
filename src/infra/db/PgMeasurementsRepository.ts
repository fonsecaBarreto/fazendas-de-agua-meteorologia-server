import { Knex } from "knex";
import { Measurement } from "../../domain/Entities/Measurements";
import { IMeasurementsRepository } from "../../domain/Interfaces";
import KnexAdapter from './KnexAdapter'

export class PgMeasurementsRepository implements IMeasurementsRepository{
     private readonly table = 'measurements'
     async find(id: string): Promise<Measurement> {
          const measurement = await KnexAdapter.connection(this.table).where({id}).first();
          return measurement
     }
     async add(entity: Measurement): Promise<void> {
          const created_at = entity.created_at || new Date();
          const updated_at = created_at
          await KnexAdapter.connection(this.table).insert({ ...entity, created_at, updated_at})
          return
     }
     async remove(id: string): Promise<boolean> {
          const rows = await KnexAdapter.connection(this.table).where({id}).delete();
          return (rows > 0 ) ? true : false 
     }

}