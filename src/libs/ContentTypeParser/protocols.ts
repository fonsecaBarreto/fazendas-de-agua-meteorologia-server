import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
export * from './errors'
export namespace IContentTypeHandler {

     /* inputs */
     export interface SchemaSpecs {
          types: string[],
          max_size: number,
          optional: boolean,
          multiples?: number
     }
     export type Schema = Record<string, SchemaSpecs>

     /* Result */
     export interface FormDataFile {
          buffer: Buffer,
          contentType: string,
          size: number
          fileName:string
     }
     export type Result = Record<string, FormDataFile[]>

     /* Error */
     export interface ConflictsParams { 
          message: string
          specs: SchemaSpecs
          fileName: string
     }

     export type Conflicts = Record<string, ConflictsParams>
     
}

export interface IContentTypeHandler {
     execute(req: ExpressRequest, res:ExpressResponse ):  Promise<void>
}

