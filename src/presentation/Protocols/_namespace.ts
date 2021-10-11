import { AppSchema, AppSchemaTools } from '../../libs/ApplicatonSchema/protocols/AppSchemaTools'

export namespace Presentation {
     export type Schema = AppSchema.Schema 
     export type Validator = AppSchemaTools.IValidator
}