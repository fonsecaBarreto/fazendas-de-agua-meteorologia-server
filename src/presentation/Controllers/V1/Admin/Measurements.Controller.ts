import { AccessType, BaseController, Ok, NotFound, Request, Response, BadRequest, Unprocessable  } from "../../../Protocols/BaseController";
import { CsvReader, Errors } from "../../../../libs/CsvReader";
import { MutiplesMeasurements_CreateParamsSchema } from '../../../Models/Schemas/MeaserumentsSchemas'
import { IMeasurementsService } from "../../../../domain/Services/Stations/Measurements_Services";
import { StationNotFoundError } from "../../../../domain/Errors/StationsErrors";
import { IStationRepository } from "../../../../domain/Interfaces";
import { MultiplesMeasurementsValidator } from "../Helpers/MultiplesMeasurementsValidator";


export class CreateMultiplesMeasurementsController extends BaseController {
     constructor(
          private readonly csvReader: CsvReader,
          private readonly measurementsValidator: MultiplesMeasurementsValidator,
          private readonly measurementsServices: Pick<IMeasurementsService,'create'>,
          private readonly stationRepository: Pick<IStationRepository,'find'>,
         
     ){ super( AccessType.ADMIN, {
          params: MutiplesMeasurements_CreateParamsSchema
     })}

     async handler(request: Request): Promise<Response> {

          const f = request.query.f === "1" ? true : false

          const station_id = request.params.station_id;

          const stationExists = await this.stationRepository.find(station_id)
          if(!stationExists) return NotFound(new StationNotFoundError())

          if(!request.files || !request.files.csv_entry || request.files.csv_entry?.length == 0 ) return NotFound("Arquivo .Csv não encontrado.")
          const { csv_entry } = request.files

          try{

               const measurementsList = await this.csvReader.read(csv_entry[0].buffer)

               const errors = await this.measurementsValidator.execute(measurementsList, station_id, f)

               if(Object.keys(errors).length > 0)
                    return Unprocessable(errors, "O Arquivo .Csv Contem dados insatisfatórios");

               const stored = await Promise.all(measurementsList.map( async ( createParams: IMeasurementsService.Params.Create, i)=>{
                    const result = await this.measurementsServices.create({ ...createParams, station_id })
                    return result
               }))
 
               return Ok(stored);
               
          } catch (err) {
          
               if(err instanceof Errors.InvalidCsvFile )
                    return BadRequest(err.message);
               throw err
          }
     }
}

``