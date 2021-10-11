import { Router, Express } from 'express'
import { controllers } from '../factories/login-factories'

const { signIn, auth } = controllers

export default function (app: Router){

     const router = Router()
     app.use('/login',router)

     router.post('/signin',signIn.execute())

     router.post('/auth',auth.execute())

}

