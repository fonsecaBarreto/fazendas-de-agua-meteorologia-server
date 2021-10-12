import { AccessType, BaseController, Forbidden, Ok, Unauthorized, Unprocessable} from "../../Protocols/BaseController";
import { NotFound, Request, Response } from "../../Protocols/Http";
import { IUsersServices, UsersServices } from "../../../domain/Services/Users/Users_Services";
import { UserNameInUseError, UserNotAllowedError, UserNotFoundError, UserRoleIsInvalidError } from "../../../domain/Errors/UsersErrors";
import { CreateUser_BodySchema, UserId_ParamsSchema, UserIdOptional_ParamsSchema, UpdateUser_BodySchema } from "../../Models/Schemas/UsersSchemas";
import { UserView } from "../../../domain/Views/UserView";
import { User, UsersRole } from "../../../domain/Entities/User";
import { AddressesServices } from "../../../domain/Services/Addresses/Addresses_Services";
import { AddressNotFoundError } from "../../../domain/Errors/AddressesErrors";
import { Address } from "../../../domain/Entities/Address";

export class CreateUserController extends BaseController {

     constructor( 
          private readonly usersServices: Pick<IUsersServices, 'create'> ,
          private readonly addressServices: Pick<AddressesServices,'appendUserToAddress' | 'find'>
     ){ super( AccessType.ADMIN, { body: CreateUser_BodySchema }) }

     async handler(request: Request): Promise<Response> {
          const { name, username, password, role, address_id } =request.body
          var address: Address;

          try{

               if (address_id) { // Verfifica se endereço existe
                    address = await this.addressServices.find(address_id)
                    if(!address) return NotFound(new AddressNotFoundError())
               }
               
               const user: UserView = await this.usersServices.create({name, username, password, role})

               if (address_id) { // Relaciona o endereço ao usuario
                    await this.addressServices.appendUserToAddress({ user, address })
               }
     
               return Ok(user);

          }catch(err){
               if(err instanceof UserRoleIsInvalidError || err instanceof UserNameInUseError ){
                    return Forbidden(err)
               }
               if( err instanceof UserNotAllowedError){
                    return Forbidden('O Endereço referenciado é inapropriado para esse usuario!')
               }
     
               throw err
          }
     }
}

export class UpdateUserController extends BaseController {

     constructor( 
          private readonly usersServices: Pick<IUsersServices, 'update'> ,
     ){ super( AccessType.ADMIN, { body: UpdateUser_BodySchema, params: UserId_ParamsSchema}) }

     async handler(request: Request): Promise<Response> {

          const id = request.params.id
          const { name, username } =request.body
          try{
               const user: UserView = await this.usersServices.update(id, { name, username })
               return Ok(user);

          }catch(err){
               if(err instanceof UserNotFoundError) {
                    return NotFound(err)
               }
               if(err instanceof UserNameInUseError) {
                    return Forbidden(err)
               }
               throw err
          }
     }
}

export class FindUserController extends BaseController {
     constructor( 
          private readonly usersServices: Pick<IUsersServices, 'find' | 'list'> ,
     ){ super( AccessType.ADMIN, { params: UserIdOptional_ParamsSchema}) }

     async handler(request: Request): Promise<Response> {

          const id = request.params.id

          if(id){
               const user: UserView = await this.usersServices.find(id)
               return Ok(user)
          }

          const users: User[] = await this.usersServices.list();
          return Ok(users);
     }
}

export class RemoveUserController extends BaseController {
     constructor( 
          private readonly usersServices: Pick<IUsersServices, 'remove'> ,
     ){ super( AccessType.ADMIN, { params: UserId_ParamsSchema}) }

     async handler(request: Request): Promise<Response> {

          const id = request.params.id
          try{
               await this.usersServices.remove(id)
               return Ok()
          }catch(err){
               if(err instanceof UserNotFoundError){
                    return NotFound(err)
               }
               throw err
          }
     }
}