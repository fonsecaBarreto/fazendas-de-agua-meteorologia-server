import { Router } from 'express'
import { ENV_VARIABLES } from '../../config/keys'

import LoginControllers from '../factories/login-factories'

export default function (router: Router, keys: ENV_VARIABLES){
     
     const { signIn, auth } = LoginControllers(keys);

     const r = Router();
     
     router.use('/login',r)

     r.post('/signin',signIn.execute())

     r.post('/auth',auth.execute())

}

