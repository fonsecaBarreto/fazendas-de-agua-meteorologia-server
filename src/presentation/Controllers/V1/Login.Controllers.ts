import { AccessType, BaseController, Ok, Unauthorized, Unprocessable} from "../../Protocols/BaseController";
import { Request, Response } from "../../Protocols/Http";
import { SignIn_BodySchema } from '../../Models/Schemas/LoginSchema'
import { AuthenticationServices } from "../../../domain/Services/Users/Authentication_Services";

export class SignInUserController extends BaseController {

     constructor( 
          private readonly authenticationServices: AuthenticationServices ){ super( AccessType.PUBLIC, { body: SignIn_BodySchema }) }

     async handler(request: Request): Promise<Response> {



          const { username, password } =request.body

          const token = await this.authenticationServices.generateToken({ username, password })
          
          if(!token) return Unauthorized()

          return Ok({ accessToken: token })
     }
}

export class AuthUserController extends BaseController {

     constructor( ){ super(AccessType.ANY_USER) }

     async handler(request: Request): Promise<Response> {
          return Ok(request.user)
     }
}
