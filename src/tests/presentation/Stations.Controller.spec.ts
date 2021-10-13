import { CreateStationController, FindStationController, RemoveStationController, UpdateStationController } from '../../presentation/Controllers/V1/Admin/Stations.Controller'

import { IStationService } from '../../domain/Services/Stations/Station_Services'

import { Forbidden, Ok, NotFound } from '../../presentation/Protocols/Http'
import { StationNotFoundError } from '../../domain/Errors/StationsErrors'

import { MakeRequest } from './mocks/MakeRequest'
import { Station } from '../../domain/Entities/Station'
import { StationView } from '../../domain/Views/StationView'
import { UserView } from '../../domain/Views/UserView'
import { MakeFakeUser } from '../mocks/entities/MakeUser'
import { MakeFakeStation } from '../mocks/entities/MakeStation'
import { AddressNotFoundError } from '../../domain/Errors/AddressesErrors'



const makeSut = () =>{
     const faked_stations = [ 
          MakeFakeStation(),
          MakeFakeStation(),
     ]
     class StationServicesStub implements IStationService {
          async create(params: IStationService.Params.Create): Promise<StationView> {
               return new StationView(MakeFakeStation())
          }
          async update(id: string, params: IStationService.Params.Update): Promise<StationView> {
               return new StationView(MakeFakeStation())
          }
          async find(id: string): Promise<StationView> {
               return new StationView(faked_stations[0])
          }
          async list(): Promise<Station[]> {
               return faked_stations;
          }
          remove(id: string): Promise<void> {
               return Promise.resolve(null)
          }

    
     }

     const stationsServices = new StationServicesStub()


     const create = new CreateStationController(stationsServices)
     const find = new FindStationController(stationsServices)
     const remove = new RemoveStationController(stationsServices)
     const update = new UpdateStationController(stationsServices)

     return { create, update, find, remove, stationsServices, faked_stations}
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


describe("FindStationController", () =>{

     test("Should return status 204 if no station were found", async () =>{
          const { find, stationsServices } = makeSut()
          jest.spyOn(stationsServices,'find').mockImplementationOnce( async()=>null)
          const req = MakeRequest({ params: { id: 'invalid_id' } })
          const res = await find.handler(req)
          expect(res).toEqual(Ok(null))
     })

     test("Should return 200", async () =>{
          const { find, faked_stations  } = makeSut()
          const req = MakeRequest({ params: { id: 'any_id' } })
          const res = await find.handler(req)
          expect(res.status).toBe(200)
          expect(res.body).toMatchObject(faked_stations[0])
     })


     test("Should return a list with 200 statyus ", async () =>{
          const { find, faked_stations } = makeSut()
          const req = MakeRequest();
          const res = await find.handler(req);
          expect(res).toMatchObject(Ok(faked_stations))

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
 