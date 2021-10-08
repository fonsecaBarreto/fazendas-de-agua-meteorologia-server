import { Address } from "../Entities/Address";
import { User, UsersRole } from "../Entities/User";
import { UserInUseError, UserNotFoundError, UserRoleIsInvalidError, UsersErrors } from "../Errors/UsersErrors";
import { IHasher } from "../Interfaces/IHasher";
import { IIdGenerator } from "../Interfaces/IIdGenerator";
import { IUserRepository } from "../Interfaces/repositories/IUserRepository";

export namespace UsersServices {
     export type CreateParams ={
          name: string
          username: string;
          password: string;
          role: UsersRole
     }

     export type UpdateParams = {
          name: string
          username: string;
          password: string;
          role: UsersRole
     } 
}

const rolesList = Object.values(UsersRole).filter(value => isNaN(Number(value)) === false);
export class UsersServices{
     constructor(
          private readonly _usersRepository: IUserRepository,
          private readonly _idGenerator: IIdGenerator,
          private readonly _hasher: IHasher
     ){}

     public async isUserAvailable(user: User): Promise<boolean> {
          const userExists = await this._usersRepository.findByUsername(user.username);
          if(userExists && userExists.id !== user.id)
               return true;
          return false;
     }

     public async create(params: UsersServices.CreateParams): Promise<User>{
          const { name, username, password, role } = params

          if(!rolesList.includes(role))
               throw new UserRoleIsInvalidError();

          const id = this._idGenerator.gen();

          const hashed_password = this._hasher.hash(password)

          const user: User ={
               id,
               name,
               username,
               password: hashed_password,
               role
          } 
          
          const notAvailable = await this.isUserAvailable(user);
          if(notAvailable) 
               throw new UserInUseError();

          await this._usersRepository.add(user); 
          return user
     }

     public async update(id:string, params: UsersServices.UpdateParams): Promise<User>{
          const { name, username, password, role } = params

          const user = await this._usersRepository.find(id);
          if(!user) 
               throw new UserNotFoundError();

          user.name = name
          user.username = username
          user.role = role

          if(password){
               user.password = this._hasher.hash(password)
          }

          const notAvailable = this.isUserAvailable(user)
          if(notAvailable) 
               throw new UserInUseError();

          await this._usersRepository.update(user);
          return user;
     }

     public async updatePassword(id:string, password:string){
          const user = await this._usersRepository.find(id)
          if(!user) 
               throw new UserNotFoundError();
          user.password = this._hasher.hash(password)
          await this._usersRepository.update(user);
     }

     async find(id:string): Promise<User>{
          const user: User = await this._usersRepository.find(id)
          return user ? user : null
     }

     async list(): Promise<User[]>{
          const users: User[] = await this._usersRepository.list()
          return users.length > 0 ? users : [];
     }
}