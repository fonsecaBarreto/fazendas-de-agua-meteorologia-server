import { Express, Request, Response, NextFunction, json, urlencoded} from 'express'
import cors from 'cors';
export default (app: Express) => {

     app.use((req: Request, res: Response, next: NextFunction) =>{
          console.log("\n > Nova Requisição:",req.method, req.path)
          next()
     })
      
     app.use(cors()) 
     app.use(json())
     app.use(urlencoded({ extended: true }))
}


