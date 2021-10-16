import { AccessType, BaseController, Ok, NotFound, Request, Response, BadRequest, Unprocessable  } from "../../../Protocols/BaseController";
import { SchemaValidator } from "../../../../libs/ApplicatonSchema/SchemaValidator";
import { CsvReader, Errors } from "../../../../libs/CsvReader";
import { Measurement_CreateBodySchema, MutiplesMeasurements_CreateParamsSchema } from '../../../Models/Schemas/MeaserumentsSchemas'
import { IMeasurementsService } from "../../../../domain/Services/Stations/Measurements_Services";
import { PgStationsRepository } from "../../../../infra/db";
import { StationNotFoundError } from "../../../../domain/Errors/StationsErrors";
import { IStationRepository } from "../../../../domain/Interfaces";
import { parseCommandLine } from "typescript";

export type CsvConflict = Record<string, SchemaValidator.Errors>

export class CreateMultiplesMeasurementsController extends BaseController {
     constructor(
          private readonly csvReader: CsvReader,
          private readonly validator: SchemaValidator,
          private readonly measurementsServices: Pick<IMeasurementsService,'create'>,
          private readonly stationRepository: Pick<IStationRepository,'find'>
         
     ){ super( AccessType.ADMIN, {
          params: MutiplesMeasurements_CreateParamsSchema
     })}

     async entryValidator(list:any[]): Promise<CsvConflict> {

          const conflits: CsvConflict = {}
          await Promise.all(list.map(async (entry, index) =>{
               const errors = await this.validator.validate(Measurement_CreateBodySchema, entry);
               if(errors){
                    conflits[index] = errors
               }
          }))

          return conflits
     }

     async handler(request: Request): Promise<Response> {

          const station_id = request.params.station_id;
          const stationExists = await this.stationRepository.find(station_id)
          if(!stationExists) return NotFound(new StationNotFoundError())

          if(!request.files || !request.files.csv_entry || request.files.csv_entry?.length == 0 ) return NotFound("Arquivo .Csv não encontrado.")
          const { csv_entry } = request.files

          try{

               const measurementsList = await this.csvReader.read(csv_entry[0].buffer)

               const errors = await this.entryValidator(measurementsList)

               if(Object.keys(errors).length > 0)
                    return Unprocessable(errors, "O Arquivo .Csv Contem dados insatisfatórios");

               await Promise.all(measurementsList.map( async ( createParams: IMeasurementsService.Params.Create)=>{
                    await this.measurementsServices.create({ ...createParams, station_id })
               }))

               return Ok();
               
          } catch (err) {
               if(err instanceof Errors.InvalidCsvFile){
                    return BadRequest(err.message)
               }
               throw err
          }
     }
}

``