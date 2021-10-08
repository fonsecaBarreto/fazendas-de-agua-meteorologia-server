import { Router, Express } from 'express'
import { controllers } from '../factories/Users/user-factories'


const { signIn } = controllers
export default async function (app: Router){

     const router = Router()
     app.use('/users',router)

     
     router.get('/login/signin',signIn.execute())


}