import { Router } from 'express'
import { ENV_VARIABLES } from '../../config/keys'
import AddressControllers from '../factories/address-factories'

export default function (router: Router, keys: ENV_VARIABLES){
     const { create, update, find, remove } = AddressControllers(keys)

     const r = Router()
     router.use('/addresses',r)
     
     r.route("/")
          .get(find.execute())
          .post(create.execute())

     r.route("/:id")
          .get(find.execute())
          .put(update.execute())
          .delete(remove.execute())
}