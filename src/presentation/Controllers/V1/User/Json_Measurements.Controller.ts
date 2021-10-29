import { AccessType, BaseController, Ok, NotFound, Request, Response, BadRequest, Unprocessable, Unauthorized, Forbidden  } from "../../../Protocols/BaseController";
import { CsvReader, Errors } from "../../../../libs/CsvReader";
import { Measurements_CreateParamsSchema, Measurement_CreateBodySchema } from '../../../Models/Schemas/MeaserumentsSchemas'
import { IMeasurementsService } from "../../../../domain/Services/Stations/Measurements_Services";
import { IStationRepository } from "../../../../domain/Interfaces";
import { SchemaValidator } from "../../../../libs/ApplicatonSchema/SchemaValidator";
import { StationNotFoundError } from "../../../../domain/Errors/StationsErrors";
import { InvalidWindDirectionError, MeasurementsDuplicatedError } from "../../../../domain/Errors/MeasurementsErrors";
import { CardialPointsList } from '../Helpers/MultiplesMeasurementsValidator'


export class Json_CreateMeasurementsController extends BaseController {
     constructor(
          private readonly _validator: SchemaValidator,
          private readonly _measurementsServices: Pick<IMeasurementsService,'create'>,
          private readonly _stationRepository: Pick<IStationRepository, 'findWithAddress_id'>,
         
     ){ super( AccessType.BASIC, { params: Measurements_CreateParamsSchema })}

     async handler(request: Request): Promise<Response> {

          const { user, params, body } = request;
          const station_id = params.station_id;

          if(!user.address) return Unauthorized();

          try{
          
               let belongs = await this._stationRepository.findWithAddress_id(station_id, user.address.id)
               if(!belongs) return Forbidden("Usuário inelegível para realizar essa interação");
               
               var errors = await this._validator.validate(Measurement_CreateBodySchema, body);

               if(!CardialPointsList.includes(body.windDirection)){
                    const errorMessage = new InvalidWindDirectionError(CardialPointsList).message;
                    errors = errors ? { ...errors, 'windDirection': errorMessage } : { 'windDirection': errorMessage }
               }

               if(errors) return Unprocessable(errors, "O JSON Contem dados insatisfatórios");

               const returned = await this._measurementsServices.create( { ...body, station_id }, true )
      
               return Ok(returned);
               
          } catch (err) {
               if(err instanceof MeasurementsDuplicatedError )
                    return BadRequest(err.message);
            
               if( err instanceof StationNotFoundError){
                    return NotFound(err)
               }
   
               throw err
          }
     }
}
