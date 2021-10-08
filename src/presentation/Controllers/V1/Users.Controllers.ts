import { DependenciesScope } from "../../../domain/dependencies";
import { ObjectValidator } from "../../../domain/Interfaces/ObjectValidator";
import { BaseController, Ok, Unauthorized, Unprocessable} from "../../Protocols/BaseController";
import { Request, Response } from "../../Protocols/Http";
import { UserSignInView, UserSignInSchema } from '../../Models/Schemas/UserSignIn'
import { AuthenticationServices } from "../../../domain/Services/AuthenticationServices";

export class SignInUserController extends BaseController {

     constructor( 
          private readonly validator: ObjectValidator,
          private readonly authenticationServices: AuthenticationServices ){ super() }

     async handler(request: Request): Promise<Response> {

          const hasError = await this.validator.validate(UserSignInSchema, request.body)
          if(hasError) return Unprocessable(hasError)
          
          const { username, password } =request.body
          
          const userCredemtials: UserSignInView = { username, password }

          const token = await this.authenticationServices.generateToken(userCredemtials)
          
          if(!token) return Unauthorized()

          return Ok({ accessToken: token })
     }
}
