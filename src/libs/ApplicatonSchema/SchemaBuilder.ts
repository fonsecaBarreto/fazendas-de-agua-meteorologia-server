import { SchemaBuilder, AppSchema } from "./protocols/AppSchemaTools";
export * from './protocols'

export default class AppSchemaBuilder implements SchemaBuilder{
 
     private properties: AppSchema.Properties = {};
     private required: string[]=[];

     setProperty(key:string, type?: string): SchemaBuilder.PropertiesHandler{

          if(!this.properties[key]){
               this.properties[key] = { type }
               this.required.push(key)
               return this.setProperty(key, type)
          }
   
          const optional = (): SchemaBuilder.PropertiesHandler =>{
               this.required.splice(this.required.indexOf(key),1)
               return this.setProperty(key)
          }

          const description = (value: string): SchemaBuilder.PropertiesHandler =>{
               this.properties[key] = { ...this.properties[key], description: value}
               return this.setProperty(key)
          }

          const actions: SchemaBuilder.PropertiesHandler = { optional, description };

          if(!this.required.includes(key)) delete actions.optional
          if(this.properties?.[key]?.description) delete actions.description
          return actions
     }

     number(key: string): SchemaBuilder.PropertiesHandler {
          return this.setProperty(key,'number')
     }
     boolean(key: string): SchemaBuilder.PropertiesHandler {
          return this.setProperty(key,'boolean')
     }
     date(key: string): SchemaBuilder.PropertiesHandler {
          return this.setProperty(key,'date')
     }
     array(key: string): SchemaBuilder.PropertiesHandler {
          return this.setProperty(key,'array')
     }
     json(key: string): SchemaBuilder.PropertiesHandler {
          return this.setProperty(key,'json')
     }
     cep(key: string): SchemaBuilder.PropertiesHandler {
          return this.setProperty(key,'cep')
     }
     uuid(key: string): SchemaBuilder.PropertiesHandler{
          return this.setProperty(key,'uuid')
     }

     string(key:string): SchemaBuilder.PropertiesHandler{
          return this.setProperty(key,'string')
     }

     public getSchema(): AppSchema.Schema{
          return ({
               type: 'object',
               properties: this.properties,
               required: this.required
          }) 
     }

     static create(callback: (instance: AppSchemaBuilder) => void): AppSchema.Schema{
          const instace =  new AppSchemaBuilder();
          callback(instace)
          return instace.getSchema()
     }
}

