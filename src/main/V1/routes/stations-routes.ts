import { Router, Express } from 'express'

import { controllers } from '../factories/stations-factories'
const { create, update, find, remove } = controllers


import { CreateMultiplesMeasurementsController } from '../../../presentation/Controllers/V1/Admin/Measurements.Controller'
const createMeasure = new CreateMultiplesMeasurementsController()

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

     router.post("/test", formDataMidleware, createMeasure.execute())

}

