import { Router, Express } from 'express'
import useRouteV1 from '../V1/index'
import { ENV_VARIABLES } from './keys'

export default async (app: Express, keys: ENV_VARIABLES): Promise<void>  => {

     app.get("/status", (req, res) =>{
          console.log("....................")
          console.log(" Server is running")
          console.log("  - PORT:", keys.PORT)
          console.log("  - ENV.:", keys.NODE_ENV)
          console.log("....................\n")
     })

     await useRouteV1(app, keys)


}
  