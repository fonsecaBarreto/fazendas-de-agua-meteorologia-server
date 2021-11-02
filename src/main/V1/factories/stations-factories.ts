import { ENV_VARIABLES } from '../../config/keys'
/* controllers */
import { CreateStationController, UpdateStationController, RemoveStationController, FindStationController} from '../../../presentation/Controllers/V1/General/Stations.Controller'
import { FindStationMetricsController } from '../../../presentation/Controllers/V1/Measurement/Station_Metrics.Controller'
/* services */
import { StationsServices } from '../../../domain/Services/Stations/Station_Services'
import { PermissionsServices } from '../../../domain/Services/Users/Permision_Services'

/* dependencies */
import { PgStationsRepository, PgAddressesRepository } from '../../../infra/db'
import { UuidAdapter } from '../../../infra'
import FindStationMetricService from '@/domain/Services/Stations/Station_Metrics_Services'

export default (keys: ENV_VARIABLES)=>{

     const stationRepository = new PgStationsRepository()
     const addressRepository = new PgAddressesRepository()
     const idGenerator = new UuidAdapter()
     
     const permissionServices = new PermissionsServices(addressRepository, stationRepository);
     const stationsServices = new StationsServices(idGenerator, stationRepository, addressRepository)
     const findStationMetricsServices = new FindStationMetricService(stationRepository)
     return ({
          create: new CreateStationController(stationsServices),   
          update: new UpdateStationController(stationsServices),
          find: new FindStationController(permissionServices,stationsServices),
          findStationMetrics: new FindStationMetricsController(findStationMetricsServices, permissionServices),
          remove: new RemoveStationController(stationsServices)    
     })
}