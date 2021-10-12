import { Router, Express } from 'express'

import { controllers } from '../factories/stations-factories'

const { create, update, find, remove } = controllers

export default async function (app: Router){

     const router = Router()
     app.use('/stations',router)

     router.route("/")
          .get(find.execute())
          .post(create.execute())

     router.route("/:id")
          .get(find.execute())
          .put(update.execute())
          .delete(remove.execute())

}

