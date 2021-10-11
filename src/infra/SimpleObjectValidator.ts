
import { captureRejections } from 'events';
import { ObjectValidator } from '../domain/Interfaces/ObjectValidator';

const makeMissingMessage = (field: string, missingMessage: string) =>{
  return missingMessage || `Campo '${field}' é obrigatório`
}

const makeInvalidMessage = (field: string, invalidMessage:string) =>{
  return invalidMessage || `Campo '${field}' contem valor inválido `
}

export class SimpleObjectValidator implements ObjectValidator{

  constructor(){}

  public async validate( schema: ObjectValidator.Schema, body: Record<string, any>): Promise< ObjectValidator.ErrorsParams>  {

    this.sanitize(schema, body)

    var params: ObjectValidator.ErrorsParams = {}

    Object.keys(schema).map( field => {

      const { type, optional, label, missingMessage, invalidMessage } = schema[field] 
      const value = body[field]

      if(type === "any") return 

      if ( value === null ){
        if(optional === true) return
        return params[field]= makeMissingMessage(label || field, missingMessage)
      } 

      let IsTypeValid = this.checkType( value, type )
      if(IsTypeValid === false) return params[field] = makeInvalidMessage(label || field, invalidMessage)
    
    })

    return Object.keys(params).length == 0 ? null : params 
  }

  private sanitize (schema: ObjectValidator.Schema, body: Record<string,any>) {

    Object.keys(body).map( param => { // Delete all unwanted params
      if(!schema[param]){ delete body[param] }
    })
    
    var initialBody = { ...body } // clone body

    Object.keys(schema).forEach( field => {

      const { type } = schema[field]
      var value = initialBody[field]

      if(value === undefined || value === "" || value == null ) return body[field] = null

      var final_value:any = value; 

      switch(type){
        case "cep": final_value = (value+"").replace(/[^\d]+/g,''); break;
        case "number": { if(!isNaN(value)) final_value = Number(value); };break;
        case "date": if(!isNaN(Date.parse(value))) final_value = new Date(value);break;
        case "boolean": final_value = JSON.parse(value); break;
      }
      return body[field] = final_value
  
    })
  }

  private checkType( value:any, type:string): boolean{
 
    switch(type){

      case "uuid" :{
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if(!regexExp.test(value)) return false
      };break;

      case "json" :{
        try { JSON.parse(value); } catch (e) { return false }
      };break;

      case "cep" : {
          const regex = /\b\d{8}\b/;
          if(!regex.test(value)) return false
      };break;

      case "date" : if( !(value instanceof Date) ) return false;break;
    
      case "array": if( Array.isArray(value) === false ) return false; break;

      default: if(type !== typeof value) return false; break;

    }

    return true
  }

}








