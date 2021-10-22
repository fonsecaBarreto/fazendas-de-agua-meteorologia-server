import { ENV_VARIABLES } from '../../config/keys'
import { Router } from 'express'

import UsersControllers from '../factories/users-factories'

export default async function (router: Router, keys: ENV_VARIABLES){

     const { create, update, find, remove } = UsersControllers(keys)

     const r = Router()
     router.use('/users',r)

     r.route("/")
          .get(find.execute())
          .post(create.execute())

     r.route("/:id")
          .get(find.execute())
          .put(update.execute())
          .delete(remove.execute())

}

