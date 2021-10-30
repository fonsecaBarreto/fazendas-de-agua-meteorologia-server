import { ENV_VARIABLES } from '../../config/keys'
/* controllers */
import { CreateMultiplesMeasurementsController } from '../../../presentation/Controllers/V1/Measurement/Multiples_Measurements_Upload.Controller'
import { CreateMeasurementsController } from '../../../presentation/Controllers/V1/Measurement/Single_Measurement_Upload.Controller'
import { Json_CreateMeasurementsController } from '../../../presentation/Controllers/V1/Measurement/Single_Measurement_Upload.Controller'
import MultiplesMeasurementsValidator from '../../../presentation/Controllers/V1/Measurement/Helpers/MultiplesMeasurementsValidator'
/* services */
import { MeasurementsService } from '../../../domain/Services/Stations/Measurements_Services'
/* dependencies */
import { PgStationsRepository, PgMeasurementsRepository } from '../../../infra/db'
import { UuidAdapter } from '../../../infra'
import Validator from '../../../libs/ApplicatonSchema/SchemaValidator'
import CsvReader from '../../../libs/CsvReader'

export default (keys: ENV_VARIABLES)=>{

     const stationRepository = new PgStationsRepository()
     const measurementsRepository = new PgMeasurementsRepository()
     const idGenerator = new UuidAdapter()
     const validator = new Validator()
     const csvReader = new CsvReader({headers:["date", "hour", "temperature", "airHumidity", "windSpeed", "windDirection", "rainVolume", "accRainVolume"]})
     const mmValidator = new MultiplesMeasurementsValidator(validator, measurementsRepository)
     const measurementsServices = new MeasurementsService(idGenerator, measurementsRepository, stationRepository)

     return {
          createMultiples: new CreateMultiplesMeasurementsController(csvReader, mmValidator, measurementsServices, stationRepository),
          create: new CreateMeasurementsController(csvReader,validator,measurementsServices,stationRepository),
          createByJson: new Json_CreateMeasurementsController(validator,measurementsServices,stationRepository)
     }
     
}