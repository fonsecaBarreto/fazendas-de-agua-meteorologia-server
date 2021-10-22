import { ENV_VARIABLES } from "../config/keys"
import { Express, Router } from "express"
import fs from "fs"
import path from 'path'
import './factories/index'

export default async (app: Express, keys: ENV_VARIABLES): Promise<void>  => {
     const router = Router()
     app.use('/api/v1', router) 

     const ROUTERS = path.join(__dirname,"routes")
     await Promise.all(fs.readdirSync(ROUTERS).map( async file => {
          const name = file.split('.').slice(0, -1).join('.')
          if(name == "index") return
          (await import(`${ROUTERS}/${file}`)).default(router, keys)
     }))
}
  