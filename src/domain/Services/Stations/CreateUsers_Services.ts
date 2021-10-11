/* 
import { IHasher, IIdGenerator, IUserRepository } from "../../Interfaces";
import { StationView } from "../../Views/StationView";
import { User, UsersRole } from "../../Entities/User";
import { Station } from "../../Entities/Station";
import { StationMissingParamsError, UserNameInUseError, UserRoleIsInvalidError } from "../../Errors/UsersErrors";
import { IAddressRepository } from "../../Interfaces/repositories/IAddressRepository";
import { AddressNotFoundError } from "../../Errors/AddressesErrors";
import { UserView } from "../../Views/UserView";

export namespace UsersServices {
     export type UserParams ={
          name: string
          username: string;
          password: string;
          role: UsersRole
     }

     export type StationParams ={
          description: string,
          longitude: number,
          latitude: number,
          altitude: number,
          address_id:string
     }
}

const rolesList = Object.values(UsersRole).filter(value => isNaN(Number(value)) === false);

export class CreateUsersServices{
     constructor(
          private readonly _idGenerator: IIdGenerator,
          private readonly _hasher: Pick<IHasher, 'hash'>,
          private readonly _usersRepository: Pick<IUserRepository, 'add' | 'addStationUser' | 'findByUsername'>,
          private readonly _addressRepository: Pick<IAddressRepository, 'find'>
     ){}

     private async assembleUser(params: UsersServices.UserParams): Promise<User>{

          const { name, username, password, role } = params

          const userExists = await this._usersRepository.findByUsername(username);
          if(userExists)
               throw new UserNameInUseError();
          
          const id = this._idGenerator.gen();

          const hashed_password = this._hasher.hash(password)

          const user: User = {  id, name, username, password: hashed_password, role } 

          return user
     }

     private async assembleStation(id: string, params: UsersServices.StationParams): Promise<Station>{

          const { address_id, description, altitude, latitude, longitude } = params

          if(address_id){
               const addressExists = await this._addressRepository.find(address_id);
               if(!addressExists)
                    throw new AddressNotFoundError();
          }
          
          const station: Station = {  id: id,  address_id, altitude,longitude, latitude, description  }
   
          return station
     }

     public async execute(params: UsersServices.UserParams, stationParams?: UsersServices.StationParams): Promise<UserView>{
          const { role } = params

          if(!rolesList.includes(role))
               throw new UserRoleIsInvalidError();

          const user = await this.assembleUser(params)
          
          if(role != UsersRole.Station){

               await this._usersRepository.add(user); 
               const userView: UserView = new UserView(user)
               return userView
           
          }else{

               if(!stationParams)
                    throw new StationMissingParamsError();

               const station = await this.assembleStation(user.id, stationParams)

               await this._usersRepository.addStationUser(user, station); 
               const stationView: StationView = new StationView(user, station)

               return stationView

          }
   
     }

} */