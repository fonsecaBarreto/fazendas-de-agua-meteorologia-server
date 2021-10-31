import { AccessType, BaseController, Forbidden, Ok } from "@/presentation/Protocols/BaseController";
import { NotFound, Request, Response } from "../../../Protocols/Http";
import { IUsersServices } from "../../../../domain/Services/Users/Users_Services";
import { UserNameInUseError, UserNotFoundError, UserRoleIsInvalidError } from "../../../../domain/Errors/UsersErrors";
import { Users_Http_Dtos } from "../../../Models/Schemas/UsersSchemas";
import { UserView } from "../../../../domain/Views/UserView";
import { User } from "../../../../domain/Entities/User";
import { AddressNotFoundError } from "../../../../domain/Errors/AddressesErrors";
import { AddressView } from "../../../../domain/Views/AddressView";

export class CreateUserController extends BaseController {

     constructor( 
          private readonly usersServices: Pick<IUsersServices, 'create'> ,
     ){ super( AccessType.ADMIN, { body: Users_Http_Dtos.Create_User_Schema }) }

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
     ){ super( AccessType.ADMIN, { body: Users_Http_Dtos.Update_User_Schema, params: Users_Http_Dtos.User_Params_Schema}) }

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
     ){ super( AccessType.ADMIN, { params: Users_Http_Dtos.User_Optional_Params_Schema }) }

     async handler(request: Request): Promise<Response> {

          const id = request.params.id

          if(id){
               const user: UserView = await this.usersServices.find(id)
               if(!user) return Ok(null)
               return Ok({...user, address: user.address ? new AddressView(user.address).getLabelView() : null })
          }

          const users: User[] = await this.usersServices.list();
          return Ok(users);
     }
}


export class RemoveUserController extends BaseController {
     constructor( 
          private readonly usersServices: Pick<IUsersServices, 'remove'> ,
     ){ super( AccessType.ADMIN, { params:  Users_Http_Dtos.User_Params_Schema }) }

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