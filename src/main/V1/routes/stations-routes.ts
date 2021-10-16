import { Router, Express } from 'express'

import { controllers } from '../factories/stations-factories'
import { controllers as MeasurementsController } from '../factories/measurements-factories'
const { create, update, find, remove } = controllers


import { FormDataMidleware } from '../middlewares/FileParse'
const formDataMidleware = FormDataMidleware({
     csv_entry: {
          optional: false,
          types: ["text/csv"],
          max_size: 8e+6,
          multiples: 1 
     },
});

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

     router.post("/:station_id/measurements", formDataMidleware, MeasurementsController.createMultiples.execute())

}

