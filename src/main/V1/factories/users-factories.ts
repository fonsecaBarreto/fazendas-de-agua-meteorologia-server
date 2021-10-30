/* controllers */
import { CreateUserController, UpdateUserController, FindUserController, RemoveUserController } from '../../../presentation/Controllers/V1/General/Users.Controllers'
/* services */
import { UsersServices } from '../../../domain/Services/Users/Users_Services'
/* dependencies */
import { PgUsersRepository, PgAddressesRepository} from '../../../infra/db'
import { BcryptAdapter, UuidAdapter } from '../../../infra'
import { ENV_VARIABLES } from '../../config/keys'

export default (keys: ENV_VARIABLES)=>{
     const usersRepository = new PgUsersRepository()
     const addressRepository = new PgAddressesRepository()

     const hasher = new BcryptAdapter()
     const idGenerator = new UuidAdapter()

     const usersServices = new UsersServices(usersRepository, addressRepository, idGenerator, hasher)

     return ({
          create: new CreateUserController(usersServices),   
          update: new UpdateUserController(usersServices),
          find: new FindUserController(usersServices),
          remove: new RemoveUserController(usersServices)    
     })
}