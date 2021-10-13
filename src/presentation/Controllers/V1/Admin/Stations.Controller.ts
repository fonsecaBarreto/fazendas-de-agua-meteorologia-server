import { IStationService } from "../../../../domain/Services/Stations/Station_Services";
import { AccessType, BaseController, Ok, NotFound, Request, Response  } from "../../../Protocols/BaseController";
import { Station_CreateBodySchema, Station_OptionalIdParams, Station_RequiredIdParams, Station_UpdateBodySchema } from '../../../Models/Schemas/StationsSchemas'
import { AddressNotFoundError } from "../../../../domain/Errors/AddressesErrors";
import { StationNotFoundError } from "../../../../domain/Errors/StationsErrors";

export class CreateStationController extends BaseController {
     constructor(
          private readonly stationsServices: Pick<IStationService, 'create'>
     ){ super( AccessType.ADMIN, { body: Station_CreateBodySchema })}

     async handler(request: Request): Promise<Response> {

          const { description, longitude, latitude, altitude, address_id } = request.body;

          try{
               const station = await this.stationsServices.create({ description, longitude, latitude, altitude, address_id });
               return Ok(station);
          }catch(err){
               if(err instanceof AddressNotFoundError ) 
                    return NotFound(err.message);
               throw err               
          }
     }
}

export class UpdateStationController extends BaseController {
     constructor(
          private readonly stationsServices: Pick<IStationService, 'update'>
     ){ super(AccessType.ADMIN, { 
          body: Station_UpdateBodySchema,
          params: Station_RequiredIdParams
     } )}

     async handler(request: Request): Promise<Response> {
          const id = request.params.id;

          const { description, longitude, latitude, altitude } = request.body;

          try{
               const station = await this.stationsServices.update( id, { description, longitude, latitude, altitude  });
               return Ok(station);
          }catch(err){
               if(err instanceof StationNotFoundError ) {
                    return NotFound(err.message);
               }

               throw err               
          }
     }
}

export class FindStationController extends BaseController {
     constructor(
          private readonly stationsServices: Pick<IStationService, 'find' | 'list'>

     ){ super(AccessType.ADMIN, { 
          params: Station_OptionalIdParams
     })}

     async handler(request: Request): Promise<Response> {

          const id = request.params.id;

          if(id){
               const station= await this.stationsServices.find(id)
               return Ok(station)
          }

          const stations = await this.stationsServices.list();
          return Ok(stations)

     }
}


export class RemoveStationController extends BaseController {
     constructor(
          private readonly stationsServices: Pick<IStationService, 'remove'>

     ){ super(AccessType.ADMIN, { 
          params: Station_RequiredIdParams
     })}

     async handler(request: Request): Promise<Response> {

          const id = request.params.id;
          try{
               await this.stationsServices.remove(id) 
               return Ok()

          }catch(err){
               if(err instanceof StationNotFoundError){
                    return NotFound(err)
               }
               throw err
          }
     }
} 
