import { IStationService } from "../../../../domain/Services/Stations/Station_Services";
import { AccessType, BaseController, Ok, NotFound, Request, Response, Unauthorized, Forbidden  } from "../../../Protocols/BaseController";
import { Station_CreateBodySchema, Station_OptionalIdParams, Station_RequiredIdParams, Station_UpdateBodySchema } from '../../../Models/Schemas/StationsSchemas'
import { AddressNotFoundError } from "../../../../domain/Errors/AddressesErrors";
import { StationNotFoundError } from "../../../../domain/Errors/StationsErrors";
import { AddressView } from "../../../../domain/Views/AddressView";
import { UsersRole } from "../../../../domain/Entities/User";
import { IStationRepository } from "../../../../domain/Interfaces";

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

export class FindStationController extends BaseController {
     constructor(
          private readonly stationsServices: Pick<IStationService, 'find'>,
          private readonly stationRepository: Pick<IStationRepository, 'findWithAddress_id'>

     ){ super(AccessType.ANY_USER, { 
          params: Station_RequiredIdParams
     })}

     async handler(request: Request): Promise<Response> {

          const { user, params } = request
          const { id : station_id } = params;

          if(user.role !== UsersRole.Admin){
               if( !user.address || ! user.address.id) return Unauthorized();
               let belongs = await this.stationRepository.findWithAddress_id(station_id, user.address.id)
               if(!belongs) return Forbidden("Usuário inelegível para realizar essa interação");
          }

          var mPage = !isNaN(request.query.p) ? Number(request.query.p) : -1;
          if(mPage < 0 ) mPage = -1

          const station= await this.stationsServices.find(station_id, mPage)
          if(!station) return Ok(null)

          return Ok({ 
               ...station, 
               address: station.address ? new AddressView(station.address).getLabelView() : null 
          })

     }
}
