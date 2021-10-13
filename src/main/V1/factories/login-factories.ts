/* controllers */
import { SignInUserController, AuthUserController } from '../../../presentation/Controllers/V1/Public/Login.Controllers'
/* services */
import { AuthenticationServices } from '../../../domain/Services/Users/Authentication_Services'
/* dependencies */
import { JsonWebTokenAdapter, BcryptAdapter } from '../../../infra'
import { PgUsersRepository } from '../../../infra/db'

const usersRepository = new PgUsersRepository()
const encryper = new JsonWebTokenAdapter("secret") // set on keys
const hasher = new BcryptAdapter()

export const authenticationServices = new AuthenticationServices(usersRepository, hasher, encryper)
/* controllers */
export const controllers = {
     signIn: new SignInUserController(authenticationServices),
     auth: new AuthUserController(),
}
