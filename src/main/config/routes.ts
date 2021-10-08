import { Router, Express } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default async (app: Express): Promise<void>  => {

     const keys = app.get('keys')
     const router = Router()

     app.get("/status", (req, res)=>{
          return res.json({
               STATUS: "Running",
               PORT: keys.port,
               ENV: keys.node_env
          })
     })

     app.use('/api/v1', router) 


     const ROUTERS = path.join(__dirname,"..","V1","routes")

     await Promise.all(readdirSync(ROUTERS).map( async file => {
         const name = file.split('.').slice(0, -1).join('.')
          if(name == "index") return
          (await import(`${ROUTERS}/${file}`)).default(router)
     }))
}
  