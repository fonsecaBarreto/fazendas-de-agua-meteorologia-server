import { v4 } from 'uuid'
import KnexAdapter from '../../../infra/db/KnexAdapter'

import { PgMeasurementsRepository } from '../../../infra/db'
import { MakeFakeMeasurement } from '../../mocks/entities/MakeMeasurement'
import { MakeFakeStation } from '../../mocks/entities/MakeStation'
import { MakeFakeAddress } from '../../mocks/entities/MakeAddress'
import { Knex } from 'knex'


const fakedAddresses = [ MakeFakeAddress({}) ];
const fakedStations = [ MakeFakeStation({ address_id: fakedAddresses[0].id}) ]
const fakedMeasurements = [  
     MakeFakeMeasurement({ station_id: fakedStations[0].id, created_at: new Date("2014-05-22") }), 
     MakeFakeMeasurement({ station_id: fakedStations[0].id, created_at: new Date("2024-05-22") }) 
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
          await KnexAdapter.connection("measurements").insert(fakedMeasurements)
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
          test(" Should not overwrite 'created_at' param", async () =>{

               const sut = makeSut();
               const fakeData = MakeFakeMeasurement({station_id: fakedStations[0].id, created_at: new Date()})
               await sut.add( fakeData );
              
               const data = await KnexAdapter.connection('measurements').where({ id: fakeData.id }).first()
               expect(data).toEqual(fakeData)
          }) 
     })


     test('Should remove measurement by id', async () =>{

          const measurementToBeRemoved = MakeFakeMeasurement({ station_id: fakedStations[0].id })
          await KnexAdapter.connection('measurements').insert(measurementToBeRemoved)

          const sut = makeSut();
          const count = await KnexAdapter.count('measurements')
    
          var result = await sut.remove(measurementToBeRemoved.id)
          expect(result).toBe(true)

          result = await sut.remove(measurementToBeRemoved.id)
          expect(result).toBe(false)

          const recontagem = await KnexAdapter.count('measurements')
          expect(recontagem).toBe(  count -1 )
     })
  
})
