import { v4 } from 'uuid'
import { StationView } from '../../../src/domain/Views/StationView'
import KnexAdapter from '../../../src/infra/db/KnexAdapter'
import { PgStationsRepository } from '../../../src/infra/db/PgStationsRepository'
import { MakeFakeAddress } from '../../mocks/entities/MakeAddress'
import { MakeFakeMeasurement } from '../../mocks/entities/MakeMeasurement'
import { MakeFakeStation } from '../../mocks/entities/MakeStation'

const makeSut = () =>{
     return new PgStationsRepository()
}

const fakeAddresses = [
     MakeFakeAddress({ city: "Campos dos Goytacazes" }),
     MakeFakeAddress({ city: "Rio das Ostras" }),
     MakeFakeAddress({ city: "Macaé" }),
];

const fakeStations = [
     MakeFakeStation({ address_id: fakeAddresses[0].id }),
     MakeFakeStation({ address_id: fakeAddresses[2].id }),

]
const fakeMeasurements = [...Array(50)].map((s, i) => MakeFakeMeasurement({station_id: fakeStations[0].id, created_at: new Date(`20${i > 9 ? i : "0"+i}-01-01`)}) )
describe("Stations Pg Repository", () =>{

     beforeAll(async ()=>{
          await KnexAdapter.open("test")
          await KnexAdapter.resetMigrations()
          await KnexAdapter.connection('addresses').insert(fakeAddresses)
          await KnexAdapter.connection('stations').insert(fakeStations)
          await KnexAdapter.connection('measurements').insert([...fakeMeasurements.map(f=>({...f, coordinates: JSON.stringify(f.coordinates)}))])
     })

     afterAll(async ()=> { await KnexAdapter.close() })


     describe("find MeasurementsByInterval", () => {
  
          test("should return null if no measurement were found", async () =>{
               const sut = makeSut();
               var result = await sut.findMeasurementsByInterval(v4(),new Date('3000-10-01'), new Date('4000-10-01'))
               expect(result).toEqual(null)
          })
          test("should find measurements", async () =>{
               const sut = makeSut();
               const result = await sut.findMeasurementsByInterval(fakeStations[0].id, new Date('2000-01-01'), new Date('2049-01-01'))
               expect(result.total).toBe(50)
               expect(result.data).toHaveLength(50)
          })
          test("should find 1/2 of the measurements", async () =>{
               const sut = makeSut();
               const result = await sut.findMeasurementsByInterval(fakeStations[0].id, new Date('2025-01-01'), new Date('2049-01-01'))
               expect(result.total).toBe(50)
               expect(result.data).toHaveLength(25)
          })
       
     })
     describe("Find Measurements", () => {

          test("should return null if no measurement or offset out of range", async () =>{
               const sut = makeSut();
               var result = await sut.findMeasurements(v4(), 0, 50)
               expect(result).toEqual(null)

               result = await sut.findMeasurements(fakeStations[0].id, 50, 50)
               expect(result).toEqual(null)
          })

          test("should find 3/5", async () =>{
               const sut = makeSut();
               const result = await sut.findMeasurements(fakeStations[0].id, 30, 50)
               expect(result.data).toHaveLength(20)
          })

          test("should find measurements", async () =>{
               const sut = makeSut();
               const result = await sut.findMeasurements(fakeStations[0].id, 1, 10)
               expect(result.total).toBe(50)
               expect(result.page_index).toBe(1)
               expect(result.page_limit).toBe(10)
               expect(result.data).toHaveLength(10)
              /*  expect(result.data[0].created_at).toEqual(fakeMeasurements[0].created_at)  */
          })
     })
     describe("Find Station ( as StationView )", () => {

          test("should return null if no station were found", async () =>{
               const sut = makeSut();
               const result = await sut.findStation(v4())
               expect(result).toBeFalsy()
          })

          test("should find station with address related", async () =>{
               const sut = makeSut();
               const result = await sut.findStation(fakeStations[0].id)
               expect(result).toMatchObject( new StationView(fakeStations[0], fakeAddresses[0]))
          })
     })
     test('Should find station By id', async () =>{
          const sut = makeSut();
          const result = await sut.find(fakeStations[0].id)
          expect(result).toMatchObject(fakeStations[0])
     })

     test('Should list stations', async () =>{
          const sut = makeSut();
          const result = await sut.list()
          expect(result).toMatchObject(fakeStations)
     })


     test('Should remove station by id', async () =>{

          const stationToBeREmoved = MakeFakeStation({address_id: fakeAddresses[1].id});
          await KnexAdapter.connection('stations').insert(stationToBeREmoved);

          const sut = makeSut();
          const count = await KnexAdapter.count('stations')
    
          var result = await sut.remove(stationToBeREmoved.id)
          expect(result).toBe(true)

          result = await sut.remove(stationToBeREmoved.id)
          expect(result).toBe(false)

          const recontagem = await KnexAdapter.count('stations')
          expect(recontagem).toBe(  count -1 )

     })
      
     describe("upsert", () =>{

          test('Should add new station', async () =>{
               const count = await KnexAdapter.count('stations')
               const sut = makeSut();
               const fakeStation = MakeFakeStation({ address_id: fakeAddresses[0].id })
               await sut.upsert(fakeStation)

               const recontagem = await KnexAdapter.count('stations')
               expect(recontagem).toBe(  count + 1 )
          })

         test('[update] Should merge station if id were found', async () =>{

               const count  = await KnexAdapter.count('stations') 
               const station = await KnexAdapter.connection('stations').where({ id: fakeStations[0].id }).first()
               expect(station).toMatchObject(fakeStations[0]) 
          
               const sut = makeSut();
               const stationToUpdate = { ...station, description:"Nova descrição" }
               await sut.upsert(stationToUpdate)

               const recontagem = await KnexAdapter.count('stations')
               expect(recontagem).toBe( count ) 

               var updatedStation = await KnexAdapter.connection('stations').where({ id: fakeStations[0].id }).first()

               expect(updatedStation).toEqual({ ...stationToUpdate, created_at: station.created_at, updated_at: updatedStation.updated_at }) 
          })
 
     }) 
})