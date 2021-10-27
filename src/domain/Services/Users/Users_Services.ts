import { Address } from "../../Entities/Address";
import { User, UsersRole } from "../../Entities/User";
import { AddressNotFoundError } from "../../Errors/AddressesErrors";
import { UserNameInUseError, UserNotAllowedError, UserNotFoundError, UserRoleIsInvalidError } from "../../Errors/UsersErrors";
import { IHasher } from "../../Interfaces/IHasher";
import { IIdGenerator } from "../../Interfaces/IIdGenerator";
import { IAddressRepository } from "../../Interfaces/repositories/IAddressRepository";
import { IUserRepository } from "../../Interfaces/repositories/IUserRepository";
import { UserView } from "../../Views/UserView";

export namespace IUsersServices {
     export namespace Params {
          export type Create ={
               name: string, 
               username: string;
               password: string;
               role: UsersRole,
               address_id?: string
          }

          export type Update = { name: string, username: string } 
     }
}

export interface IUsersServices {
     create(params: IUsersServices.Params.Create): Promise<UserView>
     update(id:string, params: IUsersServices.Params.Update): Promise<UserView>
     find(id:string): Promise<UserView>
     list(): Promise<User[]>
     remove(id:string): Promise<void>
}

const rolesList = Object.values(UsersRole).filter(value => isNaN(Number(value)) === false);

export class UsersServices implements IUsersServices{
     constructor(
          private readonly _usersRepository: IUserRepository,
          private readonly _addressRepository: Pick<IAddressRepository,'find' | 'relateUser'>,
          private readonly _idGenerator: IIdGenerator,
          private readonly _hasher: IHasher
     ){}



     async isUserAvailable(username: string, id?:string): Promise<boolean> {

          const userNameInUse = await this._usersRepository.findByUsername(username);

          if(userNameInUse && userNameInUse.id !== id)
               throw new UserNameInUseError()

          return true;
     }


     public async create(params: IUsersServices.Params.Create ): Promise<UserView>{

          const { name, username, password, role, address_id } = params
          var address: Address;

          if(!rolesList.includes(role))
               throw new UserRoleIsInvalidError();

          if (address_id) { // Verfifica se endereço existe
               address = await this._addressRepository.find(address_id)
               if(!address) throw new AddressNotFoundError()
          }
     
          await this.isUserAvailable(username)
          
          const id = this._idGenerator.gen();

          const hashed_password = this._hasher.hash(password)

          const user: User = { id, name, username, password: hashed_password, role } 

          await this._usersRepository.upsert(user); 

          if(address_id){    
               await this._addressRepository.relateUser(user.id, address_id);
          }

          const userView: UserView = new UserView(user, address)
          
          return userView
      
     }

     public async update(id:string, params: IUsersServices.Params.Update): Promise<UserView>{
          const { name, username } = params

          const user = await this._usersRepository.find(id);
          if(!user) 
               throw new UserNotFoundError();
     
          await this.isUserAvailable(username, id)

          user.name = name
          user.username = username

          await this._usersRepository.upsert(user);

          const userView: UserView = new UserView(user)

          return userView;
     }

     async find(id:string): Promise<UserView>{
          const user: UserView = await this._usersRepository.findUser(id)
          return user || null
     }

     async list(): Promise<User[]>{
          const users: User[] = await this._usersRepository.list()
          return users.length > 0 ? users : [];
     }
     
     public async remove(id:string): Promise<void>{
          const wasDeleted = await this._usersRepository.remove(id)
          if(!wasDeleted) throw new UserNotFoundError()
     }
}