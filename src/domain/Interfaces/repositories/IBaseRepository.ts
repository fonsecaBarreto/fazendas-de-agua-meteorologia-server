
export interface IBaseRepository<T> {
     add(model:T): Promise<void>
     list(): Promise<T[]>
     find(id:string): Promise<T>
     remove(id:string): Promise<boolean>
     update(model:T): Promise<void>
}