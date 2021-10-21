/* controllers */
import { CreateAddressController, UpdateAddressController, FindAddresController, RemoveAddresController } from '../../../presentation/Controllers/V1/Admin/Addresses.Controller'
/* services */
import { AddressesServices } from '../../../domain/Services/Addresses/Addresses_Services'
/* dependencies */
import { UuidAdapter } from '../../../infra'
import { PgAddressesRepository } from '../../../infra/db/PgAddressesRepository'

const idGenerator = new UuidAdapter()
const addressesRepository = new PgAddressesRepository()

const services = new AddressesServices(addressesRepository, idGenerator)

export const controllers = {
     create: new CreateAddressController(services),
     update: new UpdateAddressController(services),
     find: new FindAddresController(services),
     remove: new RemoveAddresController(services),
}
