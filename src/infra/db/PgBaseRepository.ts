import { IBaseRepository } from "../../domain/Interfaces";
import KnexAdapter from "./KnexAdapter";

export class PgBaseRepository<T> implements IBaseRepository<T> {
     constructor(
          private readonly table: string
     ){ }

     async list(): Promise<T[]> {
          const entities = await KnexAdapter.connection(this.table)
          return entities;
     }

     async find(id: string): Promise<T> {
          const query = KnexAdapter.connection(this.table).where({id}).first()
          const address = await query
          return address;
     }

     async remove(id: string): Promise<boolean> {
          const rows = await KnexAdapter.connection(this.table).where({id}).del()
          return rows > 0 ? true : false
     }

     async _upsert(model: T, mergeValues:string[] = []): Promise<void> {
          const timestamp = new Date();
          await KnexAdapter.connection(this.table).insert({ ...model, created_at: timestamp, updated_at: timestamp })
          .onConflict('id')
          .merge(mergeValues)
          return 
     }

     async upsert(model: T): Promise<void> {
          this._upsert(model)
     }
     
}