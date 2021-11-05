import { ENV_VARIABLES } from '../../config/keys'
/* controllers */
import { CreateAddressController, UpdateAddressController,  RemoveAddresController, 
     ListAddressController, FindAddresController, } from '../../../presentation/Controllers/V1/General/Addresses.Controller'
/* services */
import { AddressesServices } from '../../../domain/Services/Addresses/Addresses_Services'
/* dependencies */
import { UuidAdapter } from '../../../infra'
import { PgAddressesRepository } from '../../../infra/db/PgAddressesRepository'
import { PgStationsRepository } from '../../../infra/db'
import { PermissionsServices } from '../../../domain/Services/Users/Permision_Services'


export default (keys: ENV_VARIABLES)=>{

     const stationRepository = new PgStationsRepository()
     const addressRepository = new PgAddressesRepository()
     
     const idGenerator = new UuidAdapter()
     const addressesRepository = new PgAddressesRepository()
     const services = new AddressesServices(addressesRepository, idGenerator)

     const permissionServices = new PermissionsServices(addressRepository, stationRepository);
     return ({
          create: new CreateAddressController(services),
          update: new UpdateAddressController(services),
          find: new FindAddresController(permissionServices, services),
          list: new ListAddressController(services),
          remove: new RemoveAddresController(services),
     })
}