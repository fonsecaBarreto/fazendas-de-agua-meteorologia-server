/* import { config } from 'dotenv'
import { Router, Express } from 'express'
import { read, readdirSync } from 'fs'
import path from 'path'
import SimpleObjectValidator from '../../infra/SimpleObjectValidator'
import { BaseController, ControllerConfig } from '../../presentation/Protocols/BaseController'
import { DependenciesScope } from '../../domain/dependencies'
import { convertTypeAcquisitionFromJson } from 'typescript'

export default async (app: Express): Promise<void>  => {

     const keys = app.get('keys')
     const router = Router()
     app.use('/api', router) 

     router.get("/status", (req, res)=>{
          return res.json({
               STATUS: "Running",
               PORT: keys.port,
               ENV: keys.node_env
          })
     })

     
     const CONTROLLERS_DIR =path.join(__dirname,'..','..','presentation','Controllers')

     await Promise.all(readdirSync(CONTROLLERS_DIR).map( async file => {
         const prefix = file.split('.').slice(0, -1).join('.').split(".")[0]
         const module = (await import(`${CONTROLLERS_DIR}/${file}`))

         Object.keys(module).map((key)=>{
              
               const classeControladora =  new module[key]
               const isController = classeControladora instanceof BaseController

               if(isController == true){



                    const c = new module[key]();

                    console.log(c)
                    const { method } = c.config

                    const fullPath = path.join("/",prefix.toLowerCase(), c.config.path);

                    const route = router.route(fullPath)

                    switch(method){
                         case "post": 
                              route.post(c.execute())
                         break;

                         case "put": 
                              route.put(c.execute())
                         break;

                         case "patch": 
                              route.patch(c.execute())
                         break;

                         case "delete": 
                              route.delete(c.execute())
                         break;

                         default: 
                              route.get(c.execute())
                         break;
                    } 

               }
         })
     }))
}
   */