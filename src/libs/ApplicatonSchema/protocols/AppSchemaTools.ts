import { Interface } from "readline";
import { AppSchema } from "./AppSchema";
export * from './AppSchema'
export namespace AppSchemaTools {

     export interface ErrorsParams extends Record<string, string> {}
     export interface IValidator {
          validate(schema: AppSchema.Schema, params: Record<string, string>): Promise<ErrorsParams | null> 
     }
     
     export type PropertiesHandler= {
          optional?: () => PropertiesHandler
          description?: (desc:string) => PropertiesHandler
     }

     export interface IBuilder{
          setProperty(key:string, type?: string):PropertiesHandler
          getSchema(): AppSchema.Schema
          string(key:string): PropertiesHandler
          number(key:string): PropertiesHandler
          boolean(key:string): PropertiesHandler
          date(key:string): PropertiesHandler
          array(key:string): PropertiesHandler
          json(key:string): PropertiesHandler
          cep(key:string): PropertiesHandler
          uuid(key:string):PropertiesHandler
     }
}
