import { Station } from "../../../domain/Entities/Station";
import { StationsServices, IStationService } from '../../../domain/Services/Stations/Station_Services'
import { IdGeneratorStub } from '../../mocks/vendors/IdGeneratorStub'
import { IStationRepository } from "../../../domain/Interfaces/repositories/IStationRepository";
import { IAddressRepository } from "../../../domain/Interfaces/repositories/IAddressRepository";
import { Address } from "../../../domain/Entities/Address";
import { MakeFakeAddress } from "../../mocks/entities/MakeAddress";
import { MakeFakeStation } from "../../mocks/entities/MakeStation";
import { AddressNotFoundError } from "../../../domain/Errors/AddressesErrors";
import { StationNotFoundError } from "../../../domain/Errors/StationsErrors";
import { fake } from "faker";
import { StationView } from "../../../domain/Views/StationView";

const makeSut = () =>{
     const fake_stations = [
          MakeFakeStation(),
          MakeFakeStation()
     ]
     class StationsRepositoryStub implements IStationRepository{
          findStation(id: String): Promise<StationView> {
               return Promise.resolve(new StationView( fake_stations[0]))
          }
          async list(): Promise<Station[]> {
               return fake_stations
          }
          async find(id: string): Promise<Station> {
               return fake_stations[0]
          }
          remove(id: string): Promise<boolean> {
               return Promise.resolve(true)
          }
          upsert(model: Station): Promise<void> {
               return Promise.resolve()
          }
          
     }
     class AddressRepositoryStub implements Pick<IAddressRepository,'find'>{
          async find(id: string): Promise<Address> {
               return MakeFakeAddress()
          }

     }
     const idGenerator = new IdGeneratorStub()
     const stationsRepository = new StationsRepositoryStub()
     const AddressRepository = new AddressRepositoryStub()
     const sut = new StationsServices(idGenerator, stationsRepository, AddressRepository)

     return { sut, idGenerator, stationsRepository, AddressRepository, fake_stations}
}

const makeFakeCreateParams = (params?:Partial<IStationService.Params.Create>): IStationService.Params.Create =>{
     return ( {
          longitude: 23, 
          latitude: 33, 
          altitude: 44,
          address_id:'any_address_id',  
     })
}

describe("Station Services", () =>{
     describe("Create", () =>{
          test("Should thow error if address repository returns null", async () =>{
               const { sut, AddressRepository } = makeSut()
               jest.spyOn(AddressRepository, 'find').mockImplementationOnce(()=>{
                    return Promise.resolve(null);
               })
               const resp = sut.create(makeFakeCreateParams())
               await expect(resp).rejects.toThrow(new AddressNotFoundError())
          })

          test("Should call id generator once", async () =>{
               const { sut, idGenerator } = makeSut()
               const spy = jest.spyOn(idGenerator, 'gen')
               await sut.create(makeFakeCreateParams())
               expect(spy).toHaveBeenCalledTimes(1)
          })

          test("Should station Repository with correct values", async () =>{
               const { sut, stationsRepository } = makeSut()
               const repoSpy = jest.spyOn(stationsRepository, 'upsert')
               const params = makeFakeCreateParams()
               await sut.create(params)
               expect(repoSpy).toHaveBeenCalledWith({
                    id: "generated_id",
                    ...params
               })
          })

          test("Should return Station View", async() =>{
               const { sut, stationsRepository } = makeSut()
               const params = makeFakeCreateParams()
               const result = await sut.create(params)
               expect(result).toMatchObject({
                    id: "generated_id",
                    ...params
               })   
          })
     })

     describe("Update", () =>{

          const makeFakeUpdateParams = (params?:Partial<IStationService.Params.Update>): IStationService.Params.Update =>{
               return ( {
                    longitude: 23, 
                    latitude: 33, 
                    altitude: 44,
               })
          }
          test("Should thow error if station repository returns null", async () =>{
               const { sut, stationsRepository } = makeSut()
               jest.spyOn(stationsRepository, 'find').mockImplementationOnce(()=>{
                    return Promise.resolve(null);
               })
               const resp = sut.update('unknown_id',makeFakeUpdateParams())
               await expect(resp).rejects.toThrow(new StationNotFoundError())
          })
 

          test("Should station Repository with correct values", async () =>{
               const { sut, stationsRepository, fake_stations } = makeSut()
               const repoSpy = jest.spyOn(stationsRepository, 'upsert')
               const params = makeFakeUpdateParams({description:"Uma descrição qualquer"})
               await sut.update('any_id', params)
               expect(repoSpy).toHaveBeenCalledWith({
                    ...fake_stations[0],
                    ...params
               })
          })

          test("Should return Station View", async() =>{
               const { sut, fake_stations } = makeSut()
               const params = makeFakeUpdateParams({description:"Uma descrição qualquer"})
               const resp = await sut.update('any_id', params)
               expect(resp).toMatchObject({
                    ...fake_stations[0],
                    ...params
               })  
          }) 
     })

     describe("Find", () =>{
          test("Should return null if invalid_id", async () =>{
               const { sut, stationsRepository } = makeSut()
               jest.spyOn(stationsRepository, 'findStation').mockImplementationOnce(()=>{
                    return Promise.resolve(null);
               })
               const resp = await sut.find('any_id')
               expect(resp).toBe(null)
          })
          test("Should return StationView", async () =>{
               const { sut, fake_stations } = makeSut()
               const resp = await sut.find('any_id')
               expect(resp).toMatchObject(new StationView(fake_stations[0]))
          })
     })

     describe("List", () =>{

          test("Should return a empty list", async () =>{
               const { sut, stationsRepository } = makeSut()
               jest.spyOn(stationsRepository, "list").mockImplementationOnce(()=>{
                    return Promise.resolve([])
               })
               const resp = await sut.list()
               await expect(resp).toEqual([])
          })

          test("Should return StationView", async () =>{
               const { sut, stationsRepository, fake_stations } = makeSut()
               const resp = await sut.list()
               await expect(resp).toEqual(fake_stations)
          })
     })


     describe("remove", () =>{

          test("Should throw err if repository returns false", async () =>{
               const { sut, stationsRepository } = makeSut()
               jest.spyOn(stationsRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(false)
               })
               const resp = sut.remove('any_id')
               await expect(resp).rejects.toThrow(new StationNotFoundError())
          })


          test("Should reurn voit if repostiory returns true", async () =>{
               const { sut, stationsRepository } = makeSut()
               jest.spyOn(stationsRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(true)
               })
               const resp = await sut.remove('any_id');
               expect(resp).toBe(undefined)
          })
     })
})