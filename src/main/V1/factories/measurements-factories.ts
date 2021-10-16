/* controllers */
import { CreateMultiplesMeasurementsController } from '../../../presentation/Controllers/V1/Admin/Measurements.Controller'
/* services */
import { MeasurementsService } from '../../../domain/Services/Stations/Measurements_Services'
/* dependencies */
import { PgStationsRepository, PgMeasurementsRepository } from '../../../infra/db'
import { UuidAdapter } from '../../../infra'
import Validator from '../../../libs/ApplicatonSchema/SchemaValidator'
import CsvReader from '../../../libs/CsvReader'

const stationRepository = new PgStationsRepository()
const measurementsRepository = new PgMeasurementsRepository()

const idGenerator = new UuidAdapter()
const validator = new Validator()
const csvReader = new CsvReader()

export const measurementsServices = new MeasurementsService(idGenerator, measurementsRepository, stationRepository)

export const controllers = {
     createMultiples: new CreateMultiplesMeasurementsController(csvReader, validator, measurementsServices, stationRepository)
}