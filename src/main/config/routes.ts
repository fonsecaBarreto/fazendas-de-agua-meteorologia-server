import { Router, Express } from 'express'
import useRouteV1 from '../V1/index'

export default async (app: Express): Promise<void>  => {

     const keys = app.get('keys')

     app.get("/status", (req, res)=>{
          return res.json({
               STATUS: "Running",
               PORT: keys.port,
               ENV: keys.node_env
          })
     })

     await useRouteV1(app)


}
  