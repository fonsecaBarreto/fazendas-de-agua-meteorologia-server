import { AccessType, BaseController, Forbidden, Ok, Unauthorized, Unprocessable} from "../../Protocols/BaseController";
import { NotFound, Request, Response } from "../../Protocols/Http";
import { IUsersServices } from "../../../domain/Services/Users/Users_Services";
import { UserNameInUseError, UserNotFoundError, UserRoleIsInvalidError } from "../../../domain/Errors/UsersErrors";
import { CreateUser_BodySchema, UserId_ParamsSchema, UserIdOptional_ParamsSchema, UpdateUser_BodySchema } from "../../Models/Schemas/UsersSchemas";
import { UserView } from "../../../domain/Views/UserView";
import { User } from "../../../domain/Entities/User";
import { AddressNotFoundError } from "../../../domain/Errors/AddressesErrors";

export class CreateUserController extends BaseController {

     constructor( 
          private readonly usersServices: Pick<IUsersServices, 'create'> ,
     ){ super( AccessType.ADMIN, { body: CreateUser_BodySchema }) }

     async handler(request: Request): Promise<Response> {
          const { name, username, password, role, address_id } =request.body

          try{

               const user: UserView = await this.usersServices.create({name, username, password, role, address_id })
               return Ok(user);

          }catch(err){
               if(err instanceof UserRoleIsInvalidError || err instanceof UserNameInUseError )
                    return Forbidden(err);

               if( err instanceof AddressNotFoundError)
                    return NotFound(err);

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