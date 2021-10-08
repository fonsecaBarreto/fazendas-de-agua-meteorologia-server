
import KnexAdapter from '../../infra/db/KnexAdapter'

import { PgUsersRepository } from '../../infra/db/PgUsersRepository'
import { MakeFakeUser } from '../mocks/MakeUser'
import { MakeFakeStation } from '../mocks/MakeStation'


const makeSut = () =>{
     return new PgUsersRepository()
}

describe("Users Pg Repository", () =>{

     beforeAll(async ()=>{
          await KnexAdapter.open("test")
          await KnexAdapter.resetMigrations()
     })
     afterAll(async ()=>{
          await KnexAdapter.close()
     })
     describe("add", () =>{

          test('Should add new user', async () =>{
               const sut = makeSut();
               const result = await sut.add(MakeFakeUser({ username: "Usuario teste 1"}))
               expect(result).toBeUndefined()
          })

          test('Should add new user With a station related', async () =>{
               const sut = makeSut();
               const station = MakeFakeStation()
               const result = await sut.add(MakeFakeUser({station, username:"Usuario teste 2"}))
               expect(result).toBeUndefined()
          })

     })
})