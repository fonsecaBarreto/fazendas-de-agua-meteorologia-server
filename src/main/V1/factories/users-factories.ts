/* controllers */
import { CreateUserController, UpdateUserController, FindUserController, RemoveUserController } from '../../../presentation/Controllers/V1/Users.Controllers'
/* services */
import { UsersServices } from '../../../domain/Services/Users/Users_Services'
import { AddressesServices } from '../../../domain/Services/Addresses/Addresses_Services'
/* dependencies */
import { PgUsersRepository, PgAddressesRepository} from '../../../infra/db'
import { BcryptAdapter, UuidAdapter } from '../../../infra'

const usersRepository = new PgUsersRepository()
const addressRepository = new PgAddressesRepository()

const hasher = new BcryptAdapter()
const idGenerator = new UuidAdapter()

export const usersServices = new UsersServices(usersRepository, idGenerator, hasher)
export const addressServices = new AddressesServices(addressRepository, usersRepository, idGenerator)
/* controllers */
export const controllers = {
     create: new CreateUserController(usersServices, addressServices),   
     update: new UpdateUserController(usersServices),
     find: new FindUserController(usersServices),
     remove: new RemoveUserController(usersServices)    
}
