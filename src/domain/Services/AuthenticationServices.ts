import { decode } from "punycode";
import { User, UsersRole } from "../Entities/User";
import { IEncrypter } from "../Interfaces/IEncrypter";
import { IHasher } from "../Interfaces/IHasher";
import { IUserRepository } from "../Interfaces/repositories/IUserRepository";


export namespace AuthenticationServices {
     export type GenerateTokenParams ={
          username: string;
          password: string;
     }
}

export class AuthenticationServices{
     constructor(
          private readonly _usersRepository: Pick<IUserRepository, "find" | "findByUsername">,
          private readonly _hasher: IHasher,
          private readonly _encrypter: IEncrypter
     ){}

     public async generateToken(params: AuthenticationServices.GenerateTokenParams): Promise<string>{
          const { username, password } = params

          const userExists = await this._usersRepository.findByUsername(username);
          if(!userExists) return null

          const passwordIsCorrect = await this._hasher.compare(password, userExists.password)
          if(!passwordIsCorrect) return null

          const payload = {  id: userExists.id, username }

          try{
               const token = await this._encrypter.sign(payload);
               return token

          }catch(err){

               return null 
          } 
           
     }


     public async verifyToken(token:string): Promise<User>{ //Para o Middleware

          var decoded: any;

          try{
               decoded = await this._encrypter.verify(token)
               if(!decoded?.id) return null
               
          }catch(err) {  
               return null //403 
          }

          const user = await this._usersRepository.find(decoded.id)
          return user;
               
     }

     public async verifyRole(user: User, userRole: UsersRole): Promise<User>{
          if(user.role !== userRole) return null;
          return user
     }

     
}