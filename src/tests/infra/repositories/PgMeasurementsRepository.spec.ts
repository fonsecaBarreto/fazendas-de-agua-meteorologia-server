import { v4 } from 'uuid'
import KnexAdapter from '../../../infra/db/KnexAdapter'

import { PgMeasurementsRepository } from '../../../infra/db'
import { MakeFakeMeasurement } from '../../mocks/entities/MakeMeasurement'
import { MakeFakeStation } from '../../mocks/entities/MakeStation'
import { MakeFakeAddress } from '../../mocks/entities/MakeAddress'
import { isJSDocAugmentsTag } from 'typescript'

const fakedAddresses = [ MakeFakeAddress({}) ];
const fakedStations = [ MakeFakeStation({ address_id: fakedAddresses[0].id}) ]
const fakedMeasurements = [  
     MakeFakeMeasurement({ station_id: fakedStations[0].id, created_at: new Date("2022-04-22") }), 
     MakeFakeMeasurement({ station_id: fakedStations[0].id, created_at: new Date("2022-05-22") }) ,
     MakeFakeMeasurement({ station_id: fakedStations[0].id, created_at: new Date("2022-06-22") }) 
]

const makeSut = () =>{
     return new PgMeasurementsRepository()
}

describe("Measurements Pg Repository", () =>{

     beforeAll(async ()=>{
          await KnexAdapter.open("test")
          await KnexAdapter.resetMigrations()
          await KnexAdapter.connection("addresses").insert(fakedAddresses)
          await KnexAdapter.connection("stations").insert(fakedStations)
          await KnexAdapter.connection("measurements").insert([...fakedMeasurements.map(f=>({...f, coordinates: JSON.stringify(f.coordinates)}))])
     })
     afterAll(async ()=>{ await KnexAdapter.close()})

     describe("Find Measurement by station_id and Date", () => {
          test("should return null if no measurement were found", async () =>{
               const sut = makeSut();
               const result = await sut.findByDate(v4(), fakedMeasurements[1].created_at)
               expect(result).toBeFalsy()
          })
          test("should return data ", async () =>{
               const sut = makeSut();
               const result = await sut.findByDate(fakedStations[0].id,fakedMeasurements[1].created_at)
               expect(result).toEqual(fakedMeasurements[1])
          })
     })

     describe("Find Measurement", () => {
          test("should return null if no measurement were found", async () =>{
               const sut = makeSut();
               const result = await sut.find(v4())
               expect(result).toBeFalsy()
          })
          test("should return data ", async () =>{
               const sut = makeSut();
               const result = await sut.find(fakedMeasurements[0].id)
               expect(result).toMatchObject(fakedMeasurements[0])
          })
     })

     describe("Should add measurement", () => {
          test("should return null if no measurement were found", async () =>{
               const  count  = await KnexAdapter.count('measurements')
               const sut = makeSut();
               await sut.add(MakeFakeMeasurement({station_id: fakedStations[0].id, created_at: new Date('2040-10-02')}));
               const recontagem = await KnexAdapter.count('measurements')
               expect(recontagem).toBe( count + 1 )
          })

          test(" Should create data", async () =>{
               const sut = makeSut();
               const fakeData = MakeFakeMeasurement({station_id: fakedStations[0].id, created_at: new Date('2020-10-02')})
               await sut.add( fakeData );
               const data = await KnexAdapter.connection('measurements').where({ id: fakeData.id }).first()
               expect(data).toEqual(fakeData)
          }) 


          test(" Should merge ( measurements data only ) if same date to the same station where provided ", async () =>{
               
               const sut = makeSut();
               const fakeData = MakeFakeMeasurement({ station_id: fakedMeasurements[2].station_id, created_at: fakedMeasurements[2].created_at})

               await sut.add(fakeData);

               var data = await KnexAdapter.connection('measurements').where({ id: fakeData.id }).first()
               expect(data).toBeFalsy()

               data = await KnexAdapter.connection('measurements').where({ id: fakedMeasurements[2].id }).first()
               expect(data).toEqual({ ...fakeData, id: fakedMeasurements[2].id})
      
          }) 
     })


     test('Should remove measurement by id', async () =>{

          const toBeRemoved = MakeFakeMeasurement({ station_id: fakedStations[0].id })
          await KnexAdapter.connection('measurements').insert({ ...toBeRemoved, coordinates: JSON.stringify(toBeRemoved.coordinates)})

          const sut = makeSut();
          const count = await KnexAdapter.count('measurements')
    
          var result = await sut.remove(toBeRemoved.id)
          expect(result).toBe(true)

          result = await sut.remove(toBeRemoved.id)
          expect(result).toBe(false)

          const recontagem = await KnexAdapter.count('measurements')
          expect(recontagem).toBe(  count -1 )
     })
  
})
