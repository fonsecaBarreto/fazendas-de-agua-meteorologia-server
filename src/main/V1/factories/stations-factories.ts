/* controllers */
import { CreateStationController, UpdateStationController, RemoveStationController, FindStationController } from '../../../presentation/Controllers/V1/Admin/Stations.Controller'
/* services */
import { StationsServices } from '../../../domain/Services/Stations/Station_Services'

/* dependencies */
import { PgStationsRepository, PgAddressesRepository } from '../../../infra/db'
import { BcryptAdapter, UuidAdapter } from '../../../infra'

const stationRepository = new PgStationsRepository()
const addressRepository = new PgAddressesRepository()

const idGenerator = new UuidAdapter()

export const stationsServices = new StationsServices(idGenerator, stationRepository, addressRepository)

export const controllers = {
     create: new CreateStationController(stationsServices),   
     update: new UpdateStationController(stationsServices),
     find: new FindStationController(stationsServices),
     remove: new RemoveStationController(stationsServices)    
}
 