import KnexAdapter from '@/infra/db/KnexAdapter'
import { PgUsersRepository } from '@/infra/db/PgUsersRepository'
import { NIL } from 'uuid'
import { UserView } from '../../../src/domain/Views/UserView'
/* stubs */
import { MakeFakeAddress, MakeFakeUser } from '@/tests/mocks/entities'

const makeSut = () =>{
     return new PgUsersRepository()
}

const fakeUsers = [
     MakeFakeUser({ name: "Usuario um", username: 'Usuario01'}),
     MakeFakeUser({ name: "Usuario basico mas sem referencias", username: 'Usuario 2'}),
     MakeFakeUser({ name: "Usuario ", username: 'Usuario 3'})
]
const fakeAddress = [
     MakeFakeAddress({ city: "Campos dos Goytacazes"}),
     MakeFakeAddress({ city: "Rio das Ostras"}),
];

describe("Users Pg Repository", () =>{

     beforeAll(async ()=>{
          await KnexAdapter.open("test")
          await KnexAdapter.resetMigrations()
          await KnexAdapter.connection('users').insert(fakeUsers)
          await KnexAdapter.connection('addresses').insert(fakeAddress)
          await KnexAdapter.connection('users_addresses').insert({user_id: fakeUsers[0].id, address_id: fakeAddress[0].id})
          await KnexAdapter.connection('users_addresses').insert({user_id: fakeUsers[2].id, address_id: fakeAddress[0].id})
     })

     afterAll(async ()=>{
          await KnexAdapter.close()
     })

     describe("find User", () =>{
        
          test("should return null if no user were found", async () =>{
               const sut = makeSut();
               const result = await sut.findUser(NIL)
               expect(result).toBe(null)
          })
          test("should return no address related if user doest have any", async () =>{
               const sut = makeSut();
               const result = await sut.findUser(fakeUsers[1].id)
               expect(result).toMatchObject(new UserView({...fakeUsers[1]})) 
               expect(result).toBeTruthy()
               expect(result.address).toBe(null)
          })

          test("Should return a UserView with adress joined", async () =>{
               const sut = makeSut();
               const result = await sut.findUser(fakeUsers[0].id);
               expect(result).toMatchObject({ ...new UserView( fakeUsers[0], fakeAddress[0])} ) 
          })
          
     })  

     test('Should find user By id', async () =>{
          const sut = makeSut();
          const result = await sut.find(fakeUsers[0].id)
          expect(result).toMatchObject(fakeUsers[0])
     })

     test('Should list users', async () =>{
          const sut = makeSut();
          const result = await sut.list()
          expect(result).toMatchObject(fakeUsers)
     })

     describe("Find By Username", () =>{

          test('Should find user by username', async () =>{
               const sut = makeSut();
               const result = await sut.findByUsername(fakeUsers[0].username)
               expect(result).toMatchObject(fakeUsers[0])
          })
     })


     test('Should remove user by id', async () =>{

          const userToBeRemoved = MakeFakeUser();
          await KnexAdapter.connection('users').insert(userToBeRemoved);

          const sut = makeSut();
          const count = await KnexAdapter.count('users')
    
          var result = await sut.remove(userToBeRemoved.id)
          expect(result).toBe(true)

          result = await sut.remove(userToBeRemoved.id)
          expect(result).toBe(false)

          const recontagem = await KnexAdapter.count('users')
          expect(recontagem).toBe(  count -1 )
     })
     
     describe("upsert", () =>{

          test('Should add new user', async () =>{
               const count = await KnexAdapter.count('users')
               const sut = makeSut();
               const fakeUser = MakeFakeUser()
               await sut.upsert(fakeUser)

               const recontagem = await KnexAdapter.count('users')
               expect(recontagem).toBe(  count + 1 )
          })

         test('[update] Should merge user if id were found', async () =>{

               const count  = await KnexAdapter.count('users') 
               const user = await KnexAdapter.connection('users').where({ id: fakeUsers[0].id }).first()
               expect(user).toMatchObject(fakeUsers[0]) 
          
               const sut = makeSut();
               const userToUpdate = { ...user, username: "NovoUsername", name: "Nome atualizado" }
               await sut.upsert(userToUpdate)

               const recontagem = await KnexAdapter.count('users')
               expect(recontagem).toBe( count ) 

               var updatedUser = await KnexAdapter.connection('users').where({ id: fakeUsers[0].id }).first()

               expect(updatedUser).toEqual({ ...userToUpdate, created_at: user.created_at, updated_at: updatedUser.updated_at }) 
          })

     }) 
})