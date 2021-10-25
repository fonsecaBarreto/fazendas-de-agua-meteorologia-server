import { AccessType, BaseController, Ok, NotFound, Request, Response, BadRequest, Unprocessable, Unauthorized, Forbidden  } from "../../../Protocols/BaseController";
import { CsvReader, Errors } from "../../../../libs/CsvReader";
import { Measurements_CreateParamsSchema, Measurement_CreateBodySchema } from '../../../Models/Schemas/MeaserumentsSchemas'
import { IMeasurementsService } from "../../../../domain/Services/Stations/Measurements_Services";
import { IStationRepository } from "../../../../domain/Interfaces";
import { SchemaValidator } from "../../../../libs/ApplicatonSchema/SchemaValidator";
import { StationNotFoundError } from "../../../../domain/Errors/StationsErrors";
import { MeasurementsDuplicatedError } from "../../../../domain/Errors/MeasurementsErrors";

export class CreateMeasurementsController extends BaseController {
     constructor(
          private readonly csvReader: CsvReader,
          private readonly _validator: SchemaValidator,
          private readonly _measurementsServices: Pick<IMeasurementsService,'create'>,
          private readonly _stationRepository: Pick<IStationRepository, 'findWithAddress_id'>,
         
     ){ super( AccessType.BASIC, { params: Measurements_CreateParamsSchema })}

     async handler(request: Request): Promise<Response> {

          const { user, params } = request;
          const station_id = params.station_id;

          if(!user.address) return Unauthorized();

          let belongs = await this._stationRepository.findWithAddress_id(station_id, user.address.id)
          if(!belongs) return Forbidden("Usuário inelegível para realizar essa interação");
          
          if(!request.files || !request.files.csv_entry || request.files.csv_entry?.length == 0 ) return NotFound("Arquivo .Csv não encontrado.")
          const { csv_entry } = request.files

          try{

               const me = await this.csvReader.read(csv_entry[0].buffer);
               const measurenment_entry = { ...me[0], created_at: `${me[0].date} ${me[0].hour}`}
               
               const errors = await this._validator.validate(Measurement_CreateBodySchema, measurenment_entry);
               if(errors) return Unprocessable(errors, "O Arquivo .Csv Contem dados insatisfatórios");

               await this._measurementsServices.create( { ...measurenment_entry, station_id }, true )
      
               return Ok();
               
          } catch (err) {
               if(err instanceof Errors.InvalidCsvFile || err instanceof MeasurementsDuplicatedError )
                    return BadRequest(err.message);
            
               if( err instanceof StationNotFoundError){
                    return NotFound(err)
               }
   
               throw err
          }
     }
}

``