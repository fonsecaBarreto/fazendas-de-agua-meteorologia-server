import { ENV_VARIABLES } from '../../config/keys'
/* controllers */
import { CreateStationController, UpdateStationController, RemoveStationController, FindStationController, 
FindStationWithIntervalController } from '../../../presentation/Controllers/V1/Admin/Stations.Controller'
/* services */
import { StationsServices } from '../../../domain/Services/Stations/Station_Services'
import { PermissionsServices } from '../../../domain/Services/Users/Permision_Services'

/* dependencies */
import { PgStationsRepository, PgAddressesRepository } from '../../../infra/db'
import { UuidAdapter } from '../../../infra'

export default (keys: ENV_VARIABLES)=>{

     const stationRepository = new PgStationsRepository()
     const addressRepository = new PgAddressesRepository()
     const idGenerator = new UuidAdapter()
     
     const permissionServices = new PermissionsServices(addressRepository, stationRepository);
     const stationsServices = new StationsServices(idGenerator, stationRepository, addressRepository)
     return ({
          create: new CreateStationController(stationsServices),   
          update: new UpdateStationController(stationsServices),
          find: new FindStationController(permissionServices,stationsServices),
          findWithInterval: new FindStationWithIntervalController(permissionServices, stationsServices),
          remove: new RemoveStationController(stationsServices)    
     })
}