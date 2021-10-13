/* controllers */
import { CreateUserController, UpdateUserController, FindUserController, RemoveUserController } from '../../../presentation/Controllers/V1/Users.Controllers'
/* services */
import { UsersServices } from '../../../domain/Services/Users/Users_Services'
/* dependencies */
import { PgUsersRepository, PgAddressesRepository} from '../../../infra/db'
import { BcryptAdapter, UuidAdapter } from '../../../infra'

const usersRepository = new PgUsersRepository()
const addressRepository = new PgAddressesRepository()

const hasher = new BcryptAdapter()
const idGenerator = new UuidAdapter()

export const usersServices = new UsersServices(usersRepository, addressRepository, idGenerator, hasher)
/* controllers */
export const controllers = {
     create: new CreateUserController(usersServices),   
     update: new UpdateUserController(usersServices),
     find: new FindUserController(usersServices),
     remove: new RemoveUserController(usersServices)    
}
