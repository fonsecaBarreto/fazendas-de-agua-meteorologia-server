import express, { Express } from 'express'
import useMiddlewares from './middlewares'
import useRoutes from './routes'
import KnexAdapter from '../../infra/db/KnexAdapter'
import { ENV_VARIABLES } from './keys'


export default async (keys: ENV_VARIABLES): Promise<Express> =>{

     await KnexAdapter.open(keys.NODE_ENV);

     const app = express()

     useMiddlewares(app)
     await useRoutes(app, keys)

     return app
}