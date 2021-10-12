
import Express from 'express'
import { User, UsersRole } from '../../domain/Entities/User'
import { Request, Response, Unprocessable } from './Http'
import { Unauthorized } from './http-helper'
import { Presentation } from './_namespace'
export * from './Http'

export enum AccessType {
     PUBLIC,
     BASIC,
     ADMIN,
     ANY_USER
}

export namespace BaseController {
     export interface RequestsSchema {
          body?: Presentation.Schema,
          params?:Presentation.Schema
     }
}

export abstract class BaseController {
     public static _validator: Presentation.Validator

     constructor( 
          private readonly accessType: AccessType = AccessType.PUBLIC, 
          private readonly schemas?: BaseController.RequestsSchema ){}

     abstract handler(request: Request):  Promise<Response> 

     securityGuard (user: User): boolean {

          if(this.accessType === AccessType.PUBLIC) return true
          if(!user || user.role == null ) return false;
    
          switch(this.accessType){

               case AccessType.BASIC:
                    if(user.role != UsersRole.Basic) return false;
               break;

               case AccessType.ADMIN:
                    if(user.role != UsersRole.Admin) return false;
               break;

               default: return true // Any user
          }

          return true
     }

     public async validationGuard(req: Request): Promise<any>{


          if(this.schemas?.params){
               let hasError = await BaseController._validator.validate(this.schemas?.params, req.params)
               if(hasError) return hasError;
          } 

          if(this.schemas?.body){
               let hasError = await BaseController._validator.validate(this.schemas?.body, req.body)
               if(hasError) return hasError;
          }
 
          return null

     }


     async _handler(request: Request): Promise<Response>{

          const isSafe = await this.securityGuard(request.user)
          if(!isSafe) return Unauthorized();

          const hasErrors = await this.validationGuard(request)
          if(hasErrors) return Unprocessable(hasErrors);

          const response:Response = await this.handler(request);
          return response

     }

     execute() {
          return async (req : Express.Request, res: Express.Response, next: Express.NextFunction ) => {

               var request: Request = {  
                    headers: req.headers,
                    body: req.body || {}, 
                    params: req.params,  
                    query: req.query,
                    files: req.files,
                    user: req.user
               }

               try{
                    const response = await this._handler(request);
                    
                    if(response.status >= 400 ){
                         console.log("\n ** ClientError: ", response.body?.name || response.body)
                         return res.status(response.status).json({  error: response.body })
                    }
                    res.status(response.status).json(response.body)

               } catch(err: any) {   
                    console.log( console.log("\n ** ServerError: ", err.stack) )
                    return res.status(500).json({  error: "Erro no Servidor" } )
               }      
          }
     }
}