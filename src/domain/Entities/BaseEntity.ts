
export interface BaseEntity {
     id: string
     created_at?:Date
     updated_at?: Date
}

/* export class BaseEntity implements BaseEntityData{
     static idGenerator: IIdGenerator
     id: string
     created_at:Date
     updated_at: Date
     constructor(params: Partial<BaseEntityData>){
          this.id = params.id || BaseEntity.idGenerator.gen() 
          this.created_at  = params.created_at || new Date()
          this.updated_at = params.updated_at || new Date()
     }
} */