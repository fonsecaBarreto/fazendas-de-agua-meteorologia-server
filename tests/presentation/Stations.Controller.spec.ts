import { CreateStationController, FindStationController, RemoveStationController, UpdateStationController } from '../../src/presentation/Controllers/V1/General/Stations.Controller'
import { IStationService } from '../../src/domain/Services/Stations/Station_Services'
import { Ok, NotFound, Request, Forbidden } from '../../src/presentation/Protocols/Http'
import { StationNotFoundError } from '../../src/domain/Errors/StationsErrors'
import { MakeRequest } from './mocks/MakeRequest'
import { StationView } from '../../src/domain/Views/StationView'
import { MakeFakeStation } from '../mocks/entities/MakeStation'
import { AddressNotFoundError } from '../../src/domain/Errors/AddressesErrors'
import { MakeFakeAddress } from '../mocks/entities/MakeAddress'
import { AddressView } from '../../src/domain/Views/AddressView'
import { UserView } from '../../src/domain/Views/UserView'
import { MakeFakeUser } from '../mocks/entities/MakeUser'
import { UsersRole } from '../../src/domain/Entities/User'
import { IPermissionsServices, PermissionsServices } from '../../src/domain/Services/Users/Permision_Services'
import { UserNotAllowedError } from '../../src/domain/Errors/UsersErrors'

const makeSut = () =>{
     const faked_addresses = [
          MakeFakeAddress()
     ]
     const faked_stations = [ 
          MakeFakeStation({ address_id: faked_addresses[0].id }),
          MakeFakeStation(),
     ]
     class StationServicesStub implements IStationService {
          findWithMeasumentsByInterval(id: string, start_date: Date, end_date: Date): Promise<StationView> {
               return Promise.resolve( new StationView(faked_stations[0], faked_addresses[0]))
          }
          async create(params: IStationService.Params.Create): Promise<StationView> {
               return new StationView(MakeFakeStation())
          }
          async update(id: string, params: IStationService.Params.Update): Promise<StationView> {
               return new StationView(MakeFakeStation())
          }
          async find(id: string): Promise<StationView> {
               return new StationView(faked_stations[0],faked_addresses[0])
          }
          remove(id: string): Promise<void> {
               return Promise.resolve(null)
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

     const stationsServices = new StationServicesStub()

     const permissionServices = new PermissionServiceStub
     const create = new CreateStationController(stationsServices)
     const find = new FindStationController(permissionServices, stationsServices)
     const remove = new RemoveStationController(stationsServices)
     const update = new UpdateStationController(stationsServices)

     return { create, update, find, remove, stationsServices, faked_stations, faked_addresses, permissionServices }
}

describe("CreateUserController", () =>{

     const MakeCreateStationBody = () => {
          return ({
               description: "Estação teste",
               longitude: 22,
               latitude: 33,
               altitude: 11,
               address_id: "any_address_id"
          })
     }

     test("Should return 404 on AddressNotFoudError ", async () =>{
          const { create, stationsServices } = makeSut()

          jest.spyOn(stationsServices, 'create').mockImplementationOnce(async ()=>{
               throw new AddressNotFoundError()
          })
     
          const req = MakeRequest({ body: MakeCreateStationBody() })
          const res = await create.handler(req)
          expect(res).toEqual(NotFound(new AddressNotFoundError()))
     })


     test("Should throw error if unknown error", async () =>{
          const { create, stationsServices } = makeSut()

          jest.spyOn(stationsServices,'create').mockImplementationOnce(async()=>{
               throw new Error("Error qualquer")
          })
          const req = MakeRequest({body:MakeCreateStationBody()})
          const res = create.handler(req)
          await expect(res).rejects.toThrow()
     })

     test("Should call stations Services with correct values", async () =>{
          const { create, stationsServices } = makeSut()
          const spy = jest.spyOn(stationsServices,'create')
          const params = MakeCreateStationBody()
          const req = MakeRequest({body:params})
          await create.handler(req)
          expect(spy).toHaveBeenCalledWith(params)
     })

     test("Should return status 200 ", async () =>{
          const { create } = makeSut()
          const req = MakeRequest({body: MakeCreateStationBody()})
          const res = await create.handler(req)
          expect(res.status).toBe(200)
     })   
})

describe("UpdateStationController", () =>{

     const MakeUpdateStationBody = () => {
          return ({
               description: "Estação teste att.",
               longitude: 22.2,
               latitude: 33.3,
               altitude: 11.4,
          })
     }


     test("Should return 404 on StationNotFoundError", async () =>{
          const { update, stationsServices } = makeSut()

          jest.spyOn(stationsServices, 'update').mockImplementationOnce(async ()=>{
               throw new StationNotFoundError()
          })
     
          const req = MakeRequest({ body: MakeUpdateStationBody(), params: {id: 'any_id'} })
          const res = await update.handler(req)
          expect(res).toEqual(NotFound(new StationNotFoundError()))
     })


     test("Should throw error if unknown error", async () =>{
          const { update, stationsServices } = makeSut()

          jest.spyOn(stationsServices,'update').mockImplementationOnce(async()=>{
               throw new Error("Error qualquer")
          })
          const req = MakeRequest({body:MakeUpdateStationBody(), params: {id: 'any_id'}})
          const res = update.handler(req)
          await expect(res).rejects.toThrow()
     })

     test("Should call stations Services with correct values", async () =>{
          const { update, stationsServices } = makeSut()
          const spy = jest.spyOn(stationsServices,'update')
          const req = MakeRequest({body:MakeUpdateStationBody(), params: {id: 'any_id'}})
          await update.handler(req)
          expect(spy).toHaveBeenCalledWith( 'any_id',req.body)
     })

     test("Should return status 200 ", async () =>{
          const { update } = makeSut()
          const req = MakeRequest({body:MakeUpdateStationBody(), params: {id: 'any_id'}})
          const res = await update.handler(req)
          expect(res.status).toBe(200)
     }) 
})
describe("RemoveStationController", () =>{

     test("Should return status 404 if service throws StationNotFoundError", async () =>{
          const { remove, stationsServices } = makeSut()
   
          jest.spyOn(stationsServices,'remove').mockImplementationOnce(async ()=>{
               throw new StationNotFoundError()
          }) 
          const req = MakeRequest({params: {id: "any_id"}});
          const res = await remove.handler(req)
          expect(res).toEqual(NotFound(new StationNotFoundError())) 
     }) 

     test("Should throw error if unknown error", async () =>{
          const { remove, stationsServices } = makeSut()
          jest.spyOn(stationsServices,'remove').mockImplementationOnce(async()=>{
               throw new Error("Error qualquer")
          })
          const req = MakeRequest({params: {id: "any_id"}});
          const res = remove.handler(req)
          await expect(res).rejects.toThrow()
     })

     test("Should return Nocontent", async () =>{
          const { remove } = makeSut()
          const req = MakeRequest({params: {id: "any_id"}});
          const res = await remove.handler(req)
          expect(res).toEqual(Ok())
     }) 

})

describe("FindStationController", () =>{
     const makeFindRequest  =(fields?:Partial<Request>): Request =>{
          return MakeRequest({ 
               params: { id: 'any_id' },
               user: new UserView(MakeFakeUser({role: UsersRole.Admin})),
               ...fields
          }) 
     }

     test("Should call permisison service with correct values", async () =>{
          const { find, permissionServices } = makeSut()
          const permissionSpy = jest.spyOn(permissionServices,'isUserAllowedToStation');
          const usuario =  new UserView(MakeFakeUser({role: UsersRole.Basic }), MakeFakeAddress());
          const req = makeFindRequest({params: {id: "station_id_test"}, user: usuario});
          await find.handler(req);
          expect(permissionSpy).toHaveBeenCalledWith({ user: usuario, station_id: "station_id_test" })
     })  


     test("Should return 403 if permission service return false", async () =>{
          const { find, permissionServices } = makeSut()
          jest.spyOn(permissionServices,'isUserAllowedToStation').mockImplementationOnce( () => {
               return Promise.resolve(false)
          });
          const usuario =  new UserView(MakeFakeUser({role: UsersRole.Basic }), MakeFakeAddress());
          const req = makeFindRequest({params: {id: "station_id_test"}, user: usuario});
          const res  =await find.handler(req);
          expect(res).toEqual(Forbidden(new UserNotAllowedError()))
     }) 


     test("Should return 404 if permission throws", async () =>{
          const { find, permissionServices } = makeSut()
          jest.spyOn(permissionServices,'isUserAllowedToStation').mockImplementationOnce( () => {
               return Promise.reject(new StationNotFoundError());
          });
          const req = makeFindRequest({params: {id: "station_id_test"}});
          const res  =await find.handler(req);
          expect(res).toEqual(NotFound(new StationNotFoundError()))
     }) 
     
     test("Should call service with correct values", async () =>{
          const { find, stationsServices } = makeSut()
          const serviceSpy = jest.spyOn(stationsServices,'find');

          var req = makeFindRequest({ query:{ p:"42" } }) 
          await find.handler(req)
          expect(serviceSpy).toHaveBeenLastCalledWith('any_id',42)

          req = makeFindRequest({ params: { id: 'any_id' }, query:{p:"NaN"} }) 
          await find.handler(req)
          expect(serviceSpy).toHaveBeenLastCalledWith('any_id',-1)
     })
 
     test("Should return status 204 if no station were found", async () =>{
          const { find, stationsServices } = makeSut()
          jest.spyOn(stationsServices,'find').mockImplementationOnce( async()=>null)
          const req = makeFindRequest({ params: { id: 'invalid_id' } })
          const res = await find.handler(req)
          expect(res).toEqual(Ok(null))
     })

     test("Should return 200", async () =>{
          const { find, faked_stations, faked_addresses  } = makeSut()
          const req = makeFindRequest({ params: { id: 'any_id' } })
          const res = await find.handler(req)
          expect(res.status).toBe(200)
          expect(res.body).toEqual({ ...faked_stations[0], measurements: null, address: new AddressView(faked_addresses[0]).getLabelView()})
     }) 

})


