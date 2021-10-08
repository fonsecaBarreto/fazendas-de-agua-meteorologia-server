
import Express from 'express'
import { Request, Response } from './Http'

export * from './http-helper'


export abstract class BaseController {

     constructor( ){}

     abstract handler(request: Request):  Promise<Response> 

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

                    const response = await this.handler(request);
                    console.log(response)
                    if(response.status >= 400 ){
                         console.log("\n ** ClientError: ", response.body.name)
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