import { Express, Router } from "express"
import fs from "fs"
import path from 'path'
import './factories/index'

/* import useDocumentation from './docs/__init__'
 */
export default async (app: Express ): Promise<void>  => {
     const router = Router()
     app.use('/api/v1', router) 

     const ROUTERS = path.join(__dirname,"routes")
     await Promise.all(fs.readdirSync(ROUTERS).map( async file => {
          const name = file.split('.').slice(0, -1).join('.')
          if(name == "index") return
          (await import(`${ROUTERS}/${file}`)).default(router)
     }))

}
  