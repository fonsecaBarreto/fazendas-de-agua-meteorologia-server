import { Request, Response, NextFunction } from 'express'
/* services */
import { FileError, FormDataParser, IContentTypeHandler, InvalidContentTypeError } from '../../../libs/ContentTypeParser/FormDataParser'

export function FormDataMidleware( schema: IContentTypeHandler.Schema) {

     const formDataParser = new FormDataParser(schema)
     return async (request:Request, response: Response, next: NextFunction) => {
          try{
               await formDataParser.execute(request);
               return next()
          }catch(err){
               if(err instanceof InvalidContentTypeError)
                    return response.status(404).json({ error: err.message });

               if(err instanceof FileError){
                    return response.status(404).json({ error: {
                         message: err.message,
                         params: err.params
                    } });
               }
               return response.status(500).json({error: "Server Error."})
          }  
     }
}

