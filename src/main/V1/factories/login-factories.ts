import { ENV_VARIABLES } from '../../config/keys'
/* controllers */
import { SignInUserController, AuthUserController } from '../../../presentation/Controllers/V1/Public/Login.Controllers'
/* services */
import { AuthenticationServices } from '../../../domain/Services/Users/Authentication_Services'
/* dependencies */
import { JsonWebTokenAdapter, BcryptAdapter } from '../../../infra'
import { PgUsersRepository } from '../../../infra/db'


export default (keys: ENV_VARIABLES)=>{

     const usersRepository = new PgUsersRepository()
     const encryper = new JsonWebTokenAdapter(keys.JWT_SECRET) // set on keys
     const hasher = new BcryptAdapter()
     
     const authenticationServices = new AuthenticationServices(usersRepository, hasher, encryper)
     /* controllers */
     return {
          authenticationServices,
          signIn: new SignInUserController(authenticationServices),
          auth: new AuthUserController(),
     }
     
}