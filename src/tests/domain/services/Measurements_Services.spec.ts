
import { CardialPoints, Measurement } from "../../../domain/Entities/Measurements"
import { Station } from "../../../domain/Entities/Station";
import { MeasurementNotFoundError, MeasurementsDuplicatedError } from "../../../domain/Errors/MeasurementsErrors";
import { StationNotFoundError } from "../../../domain/Errors/StationsErrors";
import { IMeasurementsRepository, IStationRepository } from "../../../domain/Interfaces";
import { IMeasurementsService, MeasurementsService } from "../../../domain/Services/Stations/Measurements_Services"
import { MeasurementView } from "../../../domain/Views/MeasurementView";
import { StationView } from "../../../domain/Views/StationView";
import { MakeFakeMeasurement } from "../../mocks/entities/MakeMeasurement";
import { MakeFakeStation } from "../../mocks/entities/MakeStation";
import { IdGeneratorStub } from "../../mocks/vendors";

const makeSut = () =>{
     
     const mockedStations = [ MakeFakeStation() ]
     const mockedMeasurements = [ MakeFakeMeasurement({ station_id: mockedStations[0].id })]

     class MeasurementsRepositoryStub implements IMeasurementsRepository {
          findByDate(station_id: string, created_at: Date): Promise<Measurement> {
               return null
          }
          add(entity: Measurement): Promise<void> {
               return Promise.resolve()
          }
          async find(id: string): Promise<Measurement> {
               return mockedMeasurements[0];
          }
          remove(id: string): Promise<boolean> {
               return Promise.resolve(true)
          }

     }

     class StationsRepositoryStub implements Pick<IStationRepository, 'find'> {
          find(id: string): Promise<Station> {
               return Promise.resolve(mockedStations[0])
          }
     }

     const measurementsRepository = new MeasurementsRepositoryStub()
     const stationsRepository = new StationsRepositoryStub()
     const idGenerator = new IdGeneratorStub();

     const sut = new MeasurementsService(idGenerator, measurementsRepository, stationsRepository)
     return { sut, idGenerator, measurementsRepository, stationsRepository, mockedStations, mockedMeasurements }
  
}



describe("Measurement Services", () =>{
     describe("MeasurementsService.create", () =>{
          const MakeCreateMeasurementParams = (fields?: Partial<IMeasurementsService.Params.Create>): IMeasurementsService.Params.Create =>{
               return ({
                    station_id: 'any_station_id',
                    created_at: new Date(),
                    temperature: 234,
                    airHumidity: 23,
                    windSpeed: 234,
                    windDirection: CardialPoints.North,
                    rainVolume: 423,
                    AccRainVolume: 123,
                    ...fields
               })
          }

          test("Should throw error if station not found ", async () =>{
               const { sut, stationsRepository } = makeSut()
               
               jest.spyOn(stationsRepository, 'find').mockImplementationOnce(()=>{
                    return Promise.reject(new StationNotFoundError())
               })

               const resp = sut.create(MakeCreateMeasurementParams());
               await expect(resp).rejects.toThrow(new StationNotFoundError())
          })


          test("Should call measurementsRepository.findByDate always but when its 'forced'  ", async () =>{
               const { sut, measurementsRepository } = makeSut()
               const station_id = "test_station_id"
               const created_at= new Date();
               const findSpy = jest.spyOn(measurementsRepository, 'findByDate')
               await sut.create(MakeCreateMeasurementParams({station_id, created_at}), false);
               expect(findSpy).toHaveBeenCalledWith(station_id,created_at)
              
          })

          test("Should not call measurementsRepository.findByDate when 'forced' == true  ", async () =>{
               const { sut, measurementsRepository } = makeSut()
               const station_id = "test_station_id"
               const created_at= new Date();
               const findSpy = jest.spyOn(measurementsRepository, 'findByDate')
               await sut.create(MakeCreateMeasurementParams({station_id, created_at}), true);
               expect(findSpy).toHaveBeenCalledTimes(0)
              
          })

          test("Should thow error if  measurementsRepository.findByDate return data", async () =>{
               const { sut, measurementsRepository } = makeSut()

               jest.spyOn(measurementsRepository, 'findByDate').mockImplementationOnce( async ()=>{
                    return MakeFakeMeasurement()
               })
               const resp = sut.create(MakeCreateMeasurementParams(), false);
               await expect(resp).rejects.toThrow(new MeasurementsDuplicatedError())
              
          })


          test("Should call id Generator once", async () =>{
               const { sut, idGenerator } = makeSut()
               const spy = jest.spyOn(idGenerator, "gen");
               await sut.create(MakeCreateMeasurementParams())
               expect(spy).toHaveBeenCalledTimes(1)
          })

          test("Should call repository with correct values", async () =>{
               const { sut, measurementsRepository, mockedStations } = makeSut()
               const addSpy = jest.spyOn(measurementsRepository, "add");
               const params =  MakeCreateMeasurementParams({ station_id: "any_station_id" })

              await sut.create(params)
               expect(addSpy).toHaveBeenCalledWith({
                    ...params,
                    coordinates: new StationView(mockedStations[0]).getCoordinates(),
                    id: "generated_id",
               })
          })

          test("Should return data", async () =>{
               const { sut, mockedStations } = makeSut()
               const params =  MakeCreateMeasurementParams({ station_id: "any_station_id" })

               const resp = await sut.create(params)
               expect(resp).toEqual(new MeasurementView({
                    ...params,
                    coordinates: new StationView(mockedStations[0]).getCoordinates(),
                    id: "generated_id",
               } ))
          })
     })


     describe("MeasurementsService.find", () =>{
    
          test("Should return null if no measurement were found", async () =>{
               const { sut, measurementsRepository } = makeSut()
               jest.spyOn(measurementsRepository, "find").mockImplementationOnce(async () =>{
                    return null
               });
               const resp = await sut.find('invalid_id')
               await expect(resp).toBe(null)
            
          })

          test("Should return MeasurementView", async () =>{
               const { sut, mockedMeasurements } = makeSut()
               const resp = await sut.find('valid_id')
               await expect(resp).toEqual(new MeasurementView(mockedMeasurements[0]))
          }) 

     })

     describe("MeasurementsService.remove", () =>{
          test("Should throw error if repository return false", async () =>{
               const { sut, measurementsRepository } = makeSut()
               jest.spyOn(measurementsRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(false)
               })
               const resp = sut.remove('any_id')
               await expect(resp).rejects.toThrow(new MeasurementNotFoundError())
            
          })

          test("Should return void if repository retyrn true", async () =>{
               const { sut, measurementsRepository } = makeSut()
               jest.spyOn(measurementsRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(true)
               })
               const resp = await sut.remove('any_id');
               expect(resp).toBe(undefined)
          }) 
     }) 

}) 