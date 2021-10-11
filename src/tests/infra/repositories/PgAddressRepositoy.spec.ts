
import { KeyObject } from 'crypto'
import KnexAdapter from '../../../infra/db/KnexAdapter'

import { PgAddressesRepository } from '../../../infra/db/PgAddressesRepository'
import { MakeFakeAddress } from '../../mocks/entities/MakeAddress'
import { MakeFakeUser } from '../../mocks/entities/MakeUser'


const makeSut = () =>{
     return new PgAddressesRepository()
}

const initial_fake_addresses = [
     MakeFakeAddress({ city: "Campos dos Goytacazes"}),
     MakeFakeAddress({})
];

const initial_fake_user = [
     MakeFakeUser({})
];

describe("Adresses Pg Repository", () =>{

     beforeAll(async ()=>{

          await KnexAdapter.open("test")
          await KnexAdapter.resetMigrations()
          await KnexAdapter.connection('addresses').insert(initial_fake_addresses)
          await KnexAdapter.connection('users').insert(initial_fake_user)
     })
     afterAll(async ()=>{ await KnexAdapter.close()  })


     describe("Relate address to a user", () => {

          beforeEach( async ()=>{
               await KnexAdapter.connection('users_addresses').delete()
          })
          test('Should return true if was succed', async () =>{
               const sut = makeSut();
               const result = await sut.relateUser(initial_fake_user[0].id, initial_fake_addresses[0].id)
               expect(result).toBe(true)
          })

         test('Should return false entities were already related ', async () =>{
               const sut = makeSut();
               await KnexAdapter.connection("users_addresses").insert({user_id: initial_fake_user[0].id, address_id: initial_fake_addresses[0].id})
               const result = await sut.relateUser(initial_fake_user[0].id, initial_fake_addresses[0].id)
               expect(result).toBe(false)
          }) 
     })

     test('Should find address By id', async () =>{
          const sut = makeSut();
          const result = await sut.find(initial_fake_addresses[0].id)
          expect(result).toMatchObject(initial_fake_addresses[0])
     })

     test('Should list addresses', async () =>{
          const sut = makeSut();
          const result = await sut.list()
          expect(result).toMatchObject(initial_fake_addresses)
     })

     test('Should remove address by id', async () =>{

          const addressToBeRemoved = MakeFakeAddress({street:"Rua dos removido"})
          await KnexAdapter.connection('addresses').insert(addressToBeRemoved)

          const sut = makeSut();
          const  count  = await KnexAdapter.count('addresses')
    
          var result = await sut.remove(addressToBeRemoved.id)
          expect(result).toBe(true)

          result = await sut.remove(addressToBeRemoved.id)
          expect(result).toBe(false)

          const recontagem = await KnexAdapter.count('addresses')
          expect(recontagem).toBe(  count -1 )
     })

     describe("upsert", () =>{

          test('Should add new address', async () =>{

               const  count  = await KnexAdapter.count('addresses')
               const sut = makeSut();
               const fakeAddress = MakeFakeAddress()

               await sut.upsert(fakeAddress)

               const recontagem = await KnexAdapter.count('addresses')
               expect(recontagem).toBe(  count + 1 )
          })

          test('Should merge user if id were found', async () =>{

               const  count  = await KnexAdapter.count('addresses') 
               const address = await KnexAdapter.connection('addresses').where({id: initial_fake_addresses[0].id}).first()
               expect(address).toMatchObject(initial_fake_addresses[0]) 
          
               const sut = makeSut();

               const fakeAddress = { ...address, city:"Novo Iorque" }
               await sut.upsert(fakeAddress)

               const recontagem = await KnexAdapter.count('addresses')
               expect(recontagem).toBe( count ) 

               var updatedAddress = await KnexAdapter.connection('addresses').where({id: initial_fake_addresses[0].id}).first()

               expect(updatedAddress).toEqual({...fakeAddress, created_at: address.created_at, updated_at: updatedAddress.updated_at}) 
          })

     }) 
})