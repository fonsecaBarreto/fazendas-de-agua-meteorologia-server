import { ENV_VARIABLES } from '../../config/keys'
/* controllers */
import { CreateStationController, UpdateStationController, RemoveStationController, FindStationController } from '../../../presentation/Controllers/V1/Admin/Stations.Controller'
/* services */
import { StationsServices } from '../../../domain/Services/Stations/Station_Services'

/* dependencies */
import { PgStationsRepository, PgAddressesRepository } from '../../../infra/db'
import { UuidAdapter } from '../../../infra'

export default (keys: ENV_VARIABLES)=>{

     const stationRepository = new PgStationsRepository()
     const addressRepository = new PgAddressesRepository()
     const idGenerator = new UuidAdapter()
     
     const stationsServices = new StationsServices(idGenerator, stationRepository, addressRepository)
     return ({
          create: new CreateStationController(stationsServices),   
          update: new UpdateStationController(stationsServices),
          find: new FindStationController(stationsServices),
          remove: new RemoveStationController(stationsServices)    
     })
}