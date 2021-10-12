/* controllers */
import { CreateStationController, UpdateStationController, RemoveStationController, FindStationController } from '../../../presentation/Controllers/V1/Stations.Controller'
/* services */
import { StationsServices } from '../../../domain/Services/Stations/Station_Services'

/* dependencies */
/* import { PgUsersRepository, PgAddressesRepository } from '../../../infra/db'
import { BcryptAdapter, UuidAdapter } from '../../../infra'

const usersRepository = new PgUsersRepository()
const addressRepository = new PgAddressesRepository()

const hasher = new BcryptAdapter()
const idGenerator = new UuidAdapter()

export const usersServices = new UsersServices(usersRepository, idGenerator, hasher)
export const addressServices = new AddressesServices(addressRepository, idGenerator)

export const controllers = {
     create: new CreateUserController(usersServices, addressServices),   
     update: new UpdateUserController(usersServices),
     find: new FindUserController(usersServices),
     remove: new RemoveUserController(usersServices)    
}
 */