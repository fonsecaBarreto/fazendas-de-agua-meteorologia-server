import { AccessType, BaseController, Ok, NotFound, Request, Response, BadRequest, Unprocessable, Unauthorized, Forbidden  } from "../../../Protocols/BaseController";
import { CsvReader, Errors } from "../../../../libs/CsvReader";
import { Measurements_CreateParamsSchema } from '../../../Models/Schemas/MeaserumentsSchemas'
import { IMeasurementsService } from "../../../../domain/Services/Stations/Measurements_Services";
import { StationNotFoundError } from "../../../../domain/Errors/StationsErrors";
import { IStationRepository } from "../../../../domain/Interfaces";
import { MultiplesMeasurementsValidator } from "./Helpers/MultiplesMeasurementsValidator";
import { UsersRole } from "../../../../domain/Entities/User";


export class CreateMultiplesMeasurementsController extends BaseController {
     constructor(
          private readonly csvReader: CsvReader,
          private readonly measurementsValidator: MultiplesMeasurementsValidator,
          private readonly measurementsServices: Pick<IMeasurementsService,'create'>,
          private readonly stationRepository: Pick<IStationRepository,'find' | 'findWithAddress_id'>,
         
     ){ super( AccessType.ANY_USER, {
          params: Measurements_CreateParamsSchema
     })}

     async handler(request: Request): Promise<Response> {

          const { user, params } = request
          const station_id = params.station_id;

          switch(user.role){

               case UsersRole.Admin :
                    let exists = await this.stationRepository.find(station_id)
                    if(!exists) return NotFound(new StationNotFoundError())
                    break;
               case UsersRole.Basic :
                    if(request.user.address){
                         let belongs = await this.stationRepository.findWithAddress_id(station_id, request.user.address.id)
                         if(!belongs) return Forbidden("Usuário inelegível para realizar essa interação");
                         break;
                    }
               default: return Unauthorized()
          }
 
          const f: boolean = request.query.f === "1" ? true : false
          
          if(!request.files || !request.files.csv_entry || request.files.csv_entry?.length == 0 ) return NotFound("Arquivo .Csv não encontrado.")
          const { csv_entry } = request.files

          try{

               const jsonFromCsvReader = await this.csvReader.read(csv_entry[0].buffer)

               const measurementsList = jsonFromCsvReader.map((m)=>({...m, created_at: `${m.date} ${m.hour}`}));
               
               const errors = await this.measurementsValidator.execute({ list:measurementsList, station_id, skipDublicityCheck:f })

               if(Object.keys(errors).length > 0)
                    return Unprocessable(errors, "O Arquivo .Csv Contem dados insatisfatórios");

               await Promise.all(measurementsList.map( async ( createParams: IMeasurementsService.Params.Create, i)=>{
                    const result = await this.measurementsServices.create( { ...createParams, station_id }, f )
                    return result
               }))
 
               return Ok();
               
          } catch (err) {
               if(err instanceof Errors.InvalidCsvFile )
                    return BadRequest(err.message);
               throw err
          }
     }
}

``