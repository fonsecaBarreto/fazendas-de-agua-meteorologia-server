import { SignInUserController } from '../../../../presentation/Controllers/V1/Users.Controllers'
import { AuthenticationServices } from '../../../../domain/Services/AuthenticationServices'
import { JsonWebTokenAdapter, BcryptAdapter, SimpleObjectValidator } from '../../../../infra'
import { PgUsersRepository } from '../../../../infra/db/PgUsersRepository'


const usersRepository = new PgUsersRepository()
const validator = new SimpleObjectValidator()
const encryper = new JsonWebTokenAdapter("secret")
const hasher = new BcryptAdapter()


const authenticationServices = new AuthenticationServices(usersRepository, hasher, encryper)

/* controllers */

export const controllers = {
     signIn: new SignInUserController(validator, authenticationServices)
}
