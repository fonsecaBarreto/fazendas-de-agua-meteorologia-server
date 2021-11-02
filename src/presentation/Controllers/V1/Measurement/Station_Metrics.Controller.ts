import { StationNotFoundError, UserNotAllowedError } from "@/domain/Errors"
import { IFindStationMetricsService } from "@/domain/Services/Stations/Station_Metrics_Services"
import { IPermissionsServices } from "@/domain/Services/Users/Permision_Services"
import { AddressView } from "@/domain/Views"
import { Station_RequiredIdParams } from "@/presentation/Models/Schemas/StationsSchemas"
import { AccessType, BaseController, Forbidden, NotFound, Ok, Request, Response } from "@/presentation/Protocols/BaseController"

export class FindStationMetricsController extends BaseController {
     constructor(
          private readonly _stationMetricsServices: IFindStationMetricsService,
          private readonly _permissionService: IPermissionsServices
   
     ){ super(AccessType.ANY_USER, { params: Station_RequiredIdParams })}

     async handler(request: Request): Promise<Response> {

          const { user, params } = request
          const { id : station_id } = params;

          var start_date = isNaN(request.query.s) ? new Date() : new Date(Number(request.query.s));
          var intervals = isNaN(request.query.intervals) ? 1: Number(request.query.intervals);
          var amplitude = isNaN(request.query.amplitude) ? 60 : Number(request.query.amplitude);

          try{

               const isAllowed = await this._permissionService.isUserAllowedToStation({ user, station_id }) 
               if(!isAllowed) return Forbidden(new UserNotAllowedError())
               
               const station= await this._stationMetricsServices.execute({ station_id, start_date, intervals, amplitude })
               if(!station) return Ok(null)
               
               return Ok({ 
                    ...station, 
                    address: station.address ? new AddressView(station.address).getLabelView() : null 
               })
               
          }catch(err){
               if(err instanceof StationNotFoundError){
                    return NotFound(err)
               }
               throw err
          }  
     }
}
