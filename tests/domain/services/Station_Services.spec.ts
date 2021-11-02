import { Station, Address } from "@/domain/Entities";
import { SMPageFeed, StationView } from "@/domain/Views/StationView";
import { AddressNotFoundError, StationNotFoundError } from "@/domain/Errors";
import { StationsServices, IStationService } from '@/domain/Services/Stations/Station_Services'
import { IStationRepository, IAddressRepository } from "@/domain/Interfaces/repositories";
/* stubs */
import { IdGeneratorStub } from '@/tests/mocks/vendors'
import { MakeFakeMeasurement, MakeFakeAddress, MakeFakeStation } from '@/tests/mocks/entities'

const MakeMultiplesMeasurements = (n: number, station_id: string) =>{
     const ms = []
     for(let i =0 ; i < n; i ++){
          ms.push( MakeFakeMeasurement({station_id}));
     }
     return ms;
}

const makeSut = () =>{
     const fake_stations = [
          MakeFakeStation(),
          MakeFakeStation()
     ]

     const fake_measurements = MakeMultiplesMeasurements(50, fake_stations[0].id);

     class StationsRepositoryStub implements Omit<IStationRepository, 'findMeasurementsByInterval' | 'findWithAddress_id'>{

          listStationsByAddress(address_id: String): Promise<Station[]> {
               return Promise.resolve(fake_stations)
          }

          findMeasurements(id: string, offset: number, limit: number): Promise<SMPageFeed> {
               
               const mm: SMPageFeed = {
                    total: fake_measurements.length, 
                    page_index: Math.ceil(offset / limit),
                    page_limit: limit,
                    data: fake_measurements
               };
              
               return Promise.resolve(mm)
          }
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

     return { sut, idGenerator, stationsRepository, AddressRepository, fake_stations, fake_measurements}
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

     describe("Find", () =>{

          test("Should call repository.find with correct value", async () =>{
               const { sut, stationsRepository } = makeSut()
               const spy = jest.spyOn(stationsRepository, 'findStation')
               await sut.find('any_id', 0)
               expect(spy).toHaveBeenLastCalledWith('any_id')
          })
          test("Should not call repository.findMeasurements if mpage == -1", async () =>{
               const { sut, stationsRepository } = makeSut()
               const spy = jest.spyOn(stationsRepository, 'findMeasurements')

               await sut.find('any_id', -1)
               expect(spy).toHaveBeenCalledTimes(0)

               await sut.find('any_id')
               expect(spy).toHaveBeenCalledTimes(0)
          })
          test("Should call repository.findMeasurements with correct values", async () =>{
               const { sut, stationsRepository } = makeSut()
               const spy = jest.spyOn(stationsRepository, 'findMeasurements')

               await sut.find('any_id', 0)
               expect(spy).toHaveBeenLastCalledWith('any_id',0, 60)

               await sut.find('any_id', 2)
               expect(spy).toHaveBeenLastCalledWith('any_id',120, 60)
          })
          test("Should return null if invalid_id", async () =>{
               const { sut, stationsRepository } = makeSut()
               jest.spyOn(stationsRepository, 'findStation').mockImplementationOnce(()=>{
                    return Promise.resolve(null);
               })
               const resp = await sut.find('any_id')
               expect(resp).toBe(null)
          })
          test("Should return StationView", async () =>{
               const { sut, fake_stations, fake_measurements } = makeSut()
               const resp = await sut.find('any_id', 0)
               const station = new StationView(fake_stations[0], null)
               station.setMeasurements(  {
                    page_index: 0,
                    page_limit: 60,
                    total: fake_measurements.length,
                    data: fake_measurements
               })
               expect(resp).toEqual(station)
          })
     })
})