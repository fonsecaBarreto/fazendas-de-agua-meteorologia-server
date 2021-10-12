import KnexAdapter from '../../../infra/db/KnexAdapter'
import { PgStationsRepository } from '../../../infra/db/PgStationsRepository'
import { MakeFakeAddress } from '../../mocks/entities/MakeAddress'
import { MakeFakeStation } from '../../mocks/entities/MakeStation'

const makeSut = () =>{
     return new PgStationsRepository()
}

const fakeAddresses = [
     MakeFakeAddress({ city: "Campos dos Goytacazes"}),
     MakeFakeAddress({ city: "Rio das Ostras"}),
];

const fakeStations = [
     MakeFakeStation({ address_id: fakeAddresses[0].id }),
]
describe("Stations Pg Repository", () =>{

     beforeAll(async ()=>{
          await KnexAdapter.open("test")
          await KnexAdapter.resetMigrations()
          await KnexAdapter.connection('addresses').insert(fakeAddresses)
          await KnexAdapter.connection('stations').insert(fakeStations)
     })

     afterAll(async ()=> { await KnexAdapter.close() })

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