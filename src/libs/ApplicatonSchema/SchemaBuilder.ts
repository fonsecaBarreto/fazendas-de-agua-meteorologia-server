import { AppSchemaTools, AppSchema } from "./protocols/AppSchemaTools";
export * from './protocols/AppSchemaTools'

export class SchemaBuilder implements AppSchemaTools.IBuilder{
 
     private properties: AppSchema.Properties = {};
     private required: string[]=[];

     setProperty(key:string, type?: string): AppSchemaTools.PropertiesHandler{

          if(!this.properties[key]){
               this.properties[key] = { type }
               this.required.push(key)
               return this.setProperty(key, type)
          }
   
          const optional = (): AppSchemaTools.PropertiesHandler =>{
               this.required.splice(this.required.indexOf(key),1)
               return this.setProperty(key)
          }

          const description = (value: string): AppSchemaTools.PropertiesHandler =>{
               this.properties[key] = { ...this.properties[key], description: value}
               return this.setProperty(key)
          }

          const actions: AppSchemaTools.PropertiesHandler = { optional, description };

          if(!this.required.includes(key)) delete actions.optional
          if(this.properties?.[key]?.description) delete actions.description
          return actions
     }

     number(key: string): AppSchemaTools.PropertiesHandler {
          return this.setProperty(key,'number')
     }
     boolean(key: string): AppSchemaTools.PropertiesHandler {
          return this.setProperty(key,'boolean')
     }
     date(key: string): AppSchemaTools.PropertiesHandler {
          return this.setProperty(key,'date')
     }
     array(key: string): AppSchemaTools.PropertiesHandler {
          return this.setProperty(key,'array')
     }
     json(key: string): AppSchemaTools.PropertiesHandler {
          return this.setProperty(key,'json')
     }
     cep(key: string): AppSchemaTools.PropertiesHandler {
          return this.setProperty(key,'cep')
     }
     uuid(key: string): AppSchemaTools.PropertiesHandler{
          return this.setProperty(key,'uuid')
     }

     string(key:string): AppSchemaTools.PropertiesHandler{
          return this.setProperty(key,'string')
     }

     public getSchema(): AppSchema.Schema{
          return ({
               type: 'object',
               properties: this.properties,
               required: this.required
          }) 
     }

     static create(callback: (instance: AppSchemaTools.IBuilder) => void): AppSchema.Schema{
          const instace =  new SchemaBuilder();
          callback(instace)
          return instace.getSchema()
     }
}

