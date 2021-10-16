import { AccessType, BaseController, Ok, NotFound, Request, Response, BadRequest, Unprocessable  } from "../../../Protocols/BaseController";
import AppSchemaValidator, { SchemaValidator } from "../../../../libs/ApplicatonSchema/SchemaValidator";
import { CsvReader, Errors } from "../../../../libs/CsvReader";
import { Measurement } from "../../../../domain/Entities/Measurements";
import { Measurement_CreateBodySchema } from '../../../Models/Schemas/MeaserumentsSchemas'
import { IMeasurementsService } from "../../../../domain/Services/Stations/Measurements_Services";

export type CsvConflict = Record<string, SchemaValidator.Errors>

export class CreateMultiplesMeasurementsController extends BaseController {
     constructor(
          private readonly csvReader: CsvReader,
          private readonly validator: SchemaValidator,
          private readonly measurementsServices: Pick<IMeasurementsService,'create'>
         
     ){ super( AccessType.ADMIN, { })}

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

          if(!request?.files?.csv_entry) return NotFound("Arquivo .Csv não encontrado.")
          const { csv_entry } = request.files

         try{
               const measurementsList = await this.csvReader.read(csv_entry)

               const errors = await this.entryValidator(measurementsList)

               if(Object.keys(errors).length > 0)
                    return Unprocessable(errors, "O Arquivo .Csv Contem dados insatisfatórios");

               await Promise.all(measurementsList.map( async ( createParams: IMeasurementsService.Params.Create)=>{
                    await this.measurementsServices.create(createParams)
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