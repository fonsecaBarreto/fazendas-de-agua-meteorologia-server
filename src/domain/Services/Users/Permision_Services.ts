import { User, UsersRole } from "../../Entities/User";
import { StationNotFoundError } from "../../Errors/StationsErrors";
import { IAddressRepository, IStationRepository } from "../../Interfaces";
import { UserView } from "../../Views/UserView";

export namespace PermissionsServices {
     export namespace Params{

          export type isUserRelatedToAddress = {
               user: User | UserView,
               address_id: string
          }

          export type isUserAllowedToStation = {
               user: User | UserView,
               station_id: string
          }
     }
}

export interface IPermissionsServices {
     isUserRelatedToAddress (params: PermissionsServices.Params.isUserRelatedToAddress): Promise<boolean>,
     isUserAllowedToStation(params: PermissionsServices.Params.isUserAllowedToStation): Promise<boolean> 
}

export class PermissionsServices implements PermissionsServices {
     constructor(
          private readonly _addressRepository: Pick<IAddressRepository, 'isUserRelated'>,
          private readonly _stationRepository: Pick<IStationRepository, 'find'>
     ){}

     async isUserRelatedToAddress (params: PermissionsServices.Params.isUserRelatedToAddress): Promise<boolean> {
          const { user, address_id } = params
          if(!user)return false
          if(user.role === UsersRole.Admin) return true;

          const usersAddress = await this._addressRepository.isUserRelated(user.id, address_id)
          if(!usersAddress) return false

          return true;
     }

     async isUserAllowedToStation(params: PermissionsServices.Params.isUserAllowedToStation): Promise<boolean> {

          const { user, station_id } = params

          const station = await this._stationRepository.find(station_id);
          if(!station) throw new StationNotFoundError();

          return await this.isUserRelatedToAddress({user, address_id: station.address_id})
     
     }
   
}