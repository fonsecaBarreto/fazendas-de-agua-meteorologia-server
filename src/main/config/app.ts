import express, { Express } from 'express'
import useMiddlewares from './middlewares'
import useRoutes from './routes'
import KnexAdapter from '../../infra/db/KnexAdapter'


export default async (keys: Record<string, any>): Promise<Express> =>{

     await KnexAdapter.open(keys.NODE_ENV);

     const app = express()
     app.set('keys', keys)

     useMiddlewares(app)
     await useRoutes(app)

     return app
}