
export interface IBaseRepository<T> {
     list(): Promise<T[]>
     find(id:string): Promise<T>
     remove(id:string): Promise<boolean>
     upsert(model:T): Promise<void>
}
