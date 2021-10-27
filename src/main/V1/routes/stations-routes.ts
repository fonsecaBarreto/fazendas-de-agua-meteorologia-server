import { ENV_VARIABLES } from '../../config/keys'

import { Router } from 'express'
import StationControllers from '../factories/stations-factories'
import MeasurementsController from '../factories/measurements-factories'
import { FormDataMidleware } from '../middlewares/FileParse'

const formDataMidleware = FormDataMidleware({
     csv_entry: {
          optional: false,
          types: ["text/csv"],
          max_size: 10e+6,
          multiples: 1 
     },
});

export default async function (router: Router, keys: ENV_VARIABLES){

     const { create, update, find, remove } = StationControllers(keys)
     const { createMultiples, create: CreateMeasurement, createByJson } = MeasurementsController(keys)

     const r = Router()  
     router.use('/stations',r)

     r.route("/")
          .post(create.execute())

     r.route("/:id")
          .get(find.execute())
          .put(update.execute())
          .delete(remove.execute())

     r.post("/:station_id/measurements/multiples", formDataMidleware, createMultiples.execute())
     r.post("/:station_id/measurements/json", createByJson.execute())
/*      r.post("/:station_id/measurements", formDataMidleware, CreateMeasurement.execute()) */

}

