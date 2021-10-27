import { ENV_VARIABLES } from '../../config/keys'
/* controllers */
import { CreateAddressController, UpdateAddressController,  RemoveAddresController, 
     ListAddressController, FindAddresController, } from '../../../presentation/Controllers/V1/Admin/Addresses.Controller'
/* services */
import { AddressesServices } from '../../../domain/Services/Addresses/Addresses_Services'
/* dependencies */
import { UuidAdapter } from '../../../infra'
import { PgAddressesRepository } from '../../../infra/db/PgAddressesRepository'


export default (keys: ENV_VARIABLES)=>{

     const idGenerator = new UuidAdapter()
     const addressesRepository = new PgAddressesRepository()
     const services = new AddressesServices(addressesRepository, idGenerator)

     return ({
          create: new CreateAddressController(services),
          update: new UpdateAddressController(services),
          find: new FindAddresController(services, addressesRepository),
          list: new ListAddressController(services),
          remove: new RemoveAddresController(services),
     })
}