import { IStationService } from "../../../../domain/Services/Stations/Station_Services";
import { AccessType, BaseController, Ok, NotFound, Request, Response, BadRequest, Unprocessable  } from "../../../Protocols/BaseController";
import { SchemaValidator } from "../../../../libs/ApplicatonSchema/SchemaValidator";
import { CsvReader, Errors } from "../../../../libs/CsvReader";
import { Measurement } from "../../../../domain/Entities/Measurements";

import { Measurement_CreateBodySchema } from '../../../Models/Schemas/MeaserumentsSchemas'

/* 
     temperature: number
     airHumidity: number,
     rainVolume: number,
     windSpeed: number,
     windDirection: number,
     station_id: string,
     created_at: Date
 */

/* export interface CsvConflicts {
     linha: number,
     params: AppSchemaTools.ErrorsParams
} */

export class CreateMultiplesMeasurementsController extends BaseController {
     constructor(
          private readonly validator: SchemaValidator,
          private readonly csvReader: CsvReader
         
     ){ super( AccessType.ADMIN, { })}

     async entyValidator(list:any[]): Promise<any[]> {

          const lines: any = {}
          await Promise.all(list.map(async (entry, index) =>{

               const errors = await this.validator.validate(Measurement_CreateBodySchema, entry)
               lines[index] =({
                    line: index,
                    params: errors
               })
          }))

          return lines
     }

     async handler(request: Request): Promise<Response> {

          const { csv_entry } = request.files
          if(!csv_entry) return NotFound(csv_entry)

         try{
               const measurementsList = await this.csvReader.read(csv_entry)
               
               const errors = await this.entyValidator(measurementsList)
               if(errors){
                    return Unprocessable(errors, "Aprensete adadasda")
               }
               
          }catch(err){
               if(err instanceof Errors.InvalidCsvFile){
                    return BadRequest(err.message)
               }
               throw err
          }

          
          //validator linha por linha

          return Ok() 
     }
}

