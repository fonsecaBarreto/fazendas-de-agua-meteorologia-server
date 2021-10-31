
import request from 'supertest'
import MakeTestEnv, { CloseEnv, MainTestEnv } from './env_setup'
export var sut: MainTestEnv;

import { MakeAddressBodyDto } from '../mocks/dtos/MakeAddressDtos'

describe('Addresses Routes', () => {
     beforeAll(async () => { sut = await MakeTestEnv() })
     afterAll(async () => { await CloseEnv()  })

    describe('POST /addresses', () => {

          const CREATE_ADDRESS_ROUTE = "/api/v1/addresses"

          test('Should return 401 on missing or basic user', async () => {
               await request(sut.app)
               .post(CREATE_ADDRESS_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.basic}`).send()
               .expect(401) 
          })

          test('Should return 400 on missing body', async () => {
               await request(sut.app)
               .post(CREATE_ADDRESS_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          })

          test('Should return 400 invalid UF', async () => {
               await request(sut.app)
               .post(CREATE_ADDRESS_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(MakeAddressBodyDto({uf:"invalid"}))
               .expect(400) 
          }) 
     
      
     })

})