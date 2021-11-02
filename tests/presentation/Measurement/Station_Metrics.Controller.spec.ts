import { IFindStationMetricsService } from "@/domain/Services/Stations/Station_Metrics_Services";
import { StationView, UserView } from "@/domain/Views";
import { MakeFakeAddress, MakeFakeStation, MakeFakeUser } from "@/tests/mocks/entities";

import { FindStationMetricsController } from "@/presentation/Controllers/V1/Measurement/Station_Metrics.Controller";
import { Forbidden, NotFound, Ok, Request } from "@/presentation/Protocols/BaseController";
import { IPermissionsServices, PermissionsServices } from "@/domain/Services/Users/Permision_Services";

/* stubs */
import { MakeFakeMeasurementMetrics } from "@/tests/mocks/dtos/MakeMeasurementsDtos";
import { MakeRequest } from "@/tests/presentation/mocks/MakeRequest";
import { UsersRole } from "@/domain/Entities";
import { StationNotFoundError, UserNotAllowedError } from "@/domain/Errors";

const makeSut = () =>{
    
     class FindStationMetricsServicesStub implements IFindStationMetricsService {
          execute(params: IFindStationMetricsService.Params): Promise<StationView> {
               const station = new StationView(MakeFakeStation())
               station.setMeasurements({ ...params, data: [MakeFakeMeasurementMetrics()]})
               return Promise.resolve(station)
          }
     } 

     class PermissionServiceStub implements  IPermissionsServices{
          isUserRelatedToAddress(params: PermissionsServices.Params.isUserRelatedToAddress): Promise<boolean> {
               return Promise.resolve(true);
          }
          isUserAllowedToStation(params: PermissionsServices.Params.isUserAllowedToStation): Promise<boolean> {
               return Promise.resolve(true);
          }
     }

     const findStationMetricsServices = new FindStationMetricsServicesStub()
     const permissionServices = new PermissionServiceStub
     const controller = new FindStationMetricsController(findStationMetricsServices, permissionServices)

     return { controller, findStationMetricsServices, permissionServices }
}

describe("FindStationMetricsController", () =>{

     const makeFindRequest  =(fields?:Partial<Request>): Request =>{
          return MakeRequest({
               params: { id: "any_station_id"},
               user: new UserView(MakeFakeUser()),
               ...fields
          }) 
     }
     test("Should call permisison service with correct values", async () =>{
          const { controller, permissionServices } = makeSut()
          
          const permissionSpy = jest.spyOn(permissionServices,'isUserAllowedToStation');
          const usuario =  new UserView(MakeFakeUser({role: UsersRole.Basic }), MakeFakeAddress());
          
          const req = makeFindRequest({params: {id: "station_id_test"}, user: usuario});
          
          await controller.handler(req);
          expect(permissionSpy).toHaveBeenCalledWith({ user: usuario, station_id: "station_id_test" })
     })  
     test("Should return 403 if permission service return false", async () =>{
          const { controller, permissionServices } = makeSut()
          jest.spyOn(permissionServices,'isUserAllowedToStation').mockImplementationOnce( () => {
               return Promise.resolve(false)
          });
          const usuario =  new UserView(MakeFakeUser({role: UsersRole.Basic }), MakeFakeAddress());
          const req = makeFindRequest({params: {id: "station_id_test"}, user: usuario});
          const res  =await controller.handler(req);
          expect(res).toEqual(Forbidden(new UserNotAllowedError()))
     }) 
     test("Should return 404 if permission throws", async () =>{
          const { controller, permissionServices } = makeSut()
          jest.spyOn(permissionServices,'isUserAllowedToStation').mockImplementationOnce( () => {
               return Promise.reject(new StationNotFoundError());
          });
          const req = makeFindRequest({params: {id: "station_id_test"}});
          const res  =await controller.handler(req);
          expect(res).toEqual(NotFound(new StationNotFoundError()))
     }) 
     test("Should call service with correct values", async () =>{
           const { controller, findStationMetricsServices } = makeSut()
          const serviceSpy = jest.spyOn(findStationMetricsServices,'execute');

          var req = makeFindRequest({ query:{ s:"1604011932000", intervals: "7", amplitude: "120 "} }) 
          await controller.handler(req);

          expect(serviceSpy).toHaveBeenLastCalledWith({station_id: 'any_station_id', start_date: new Date(1604011932000), intervals: 7, amplitude: 120});
     }) 
  
     test("Should return status 204 if no station were found", async () =>{
          const { controller, findStationMetricsServices } = makeSut()
          jest.spyOn(findStationMetricsServices,'execute').mockImplementationOnce( async()=> null )
          const req = makeFindRequest({ params: { id: 'invalid_id' } })
          const res = await controller.handler(req)
          expect(res).toEqual(Ok(null))
     })

     test("Should return 200", async () =>{
          const { controller} = makeSut()
          const req = makeFindRequest({ params: { id: 'any_id' } })
          const res = await controller.handler(req)
          expect(res.status).toBe(200)
          expect(res.body).toBeTruthy()
     })  

})
 

