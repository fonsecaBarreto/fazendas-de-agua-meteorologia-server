
export namespace AppSchema {

     export interface PropertyRow { 
          type: string,
          description?: string
     }
     export type Properties = Record<string, PropertyRow> 

     export interface Schema {
          type: string,
          properties: Properties,
          required: string[]
     }


}

