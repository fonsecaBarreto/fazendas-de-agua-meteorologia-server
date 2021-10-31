
import request from 'supertest'
import MakeTestEnv, { CloseEnv, MainTestEnv } from './env_setup'
import KnexAdapter from '@/infra/db/KnexAdapter'

import { MakeAddressBodyDto } from '@/tests/mocks/dtos/MakeAddressDtos'
import { MakeFakeAddress } from '../mocks/entities';
import { NIL } from 'uuid';
import { AddressView } from '@/domain/Views';
const ADDRESS_CRUD_BASE_ROUTE = "/api/v1/addresses"

export var sut: MainTestEnv;
describe('Addresses Routes', () => {
     beforeAll(async () => { sut = await MakeTestEnv() })
     afterAll(async () => { await CloseEnv() })

     describe('POST /addresses', () => {
          const address_to_create = MakeAddressBodyDto({ street:"address_to_create"});

          afterAll( async ()=>{
               await KnexAdapter.connection("addresses").delete().where({ street: address_to_create.street})
          })

          test('Should return 401 on missing or basic user', async () => {
               await request(sut.app)
               .post(ADDRESS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.basic}`).send()
               .expect(401) 
          })

          test('Should return 400 on invalid body', async () => {
               await request(sut.app)
               .post(ADDRESS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          })

          test('Should return 400 invalid UF', async () => {
               await request(sut.app)
               .post(ADDRESS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(MakeAddressBodyDto({uf:"invalid"}))
               .expect(400) 
          }) 

          test('Should return 200 ', async () => {
               await request(sut.app)
               .post(ADDRESS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(address_to_create)
               .expect(200) 
          }) 
     
     })

     describe('PUT /addresses/:id', () => {
          const address_to_update = [ MakeFakeAddress()]
          beforeAll( async ()=>{
               await KnexAdapter.connection("addresses").insert(address_to_update)
          })

          afterAll( async ()=>{
               await KnexAdapter.connection("addresses").delete().where({ id: address_to_update[0].id})
          })
          test('Should return 401 on missing token or basic user', async () => {
               await request(sut.app)
               .put(`${ADDRESS_CRUD_BASE_ROUTE}/${address_to_update[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.basic}`).send()
               .expect(401) 
          })

          test('Should return 400 if invalid params', async () => {
               await request(sut.app)
               .put(`${ADDRESS_CRUD_BASE_ROUTE}/not_a_valid_id`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          })

          test('Should return 400 on invalid body', async () => {
               await request(sut.app)
               .put(`${ADDRESS_CRUD_BASE_ROUTE}/${address_to_update[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          })

          test('Should return 404', async () => {
               await request(sut.app)
               .put(`${ADDRESS_CRUD_BASE_ROUTE}/${NIL}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(MakeAddressBodyDto())
               .expect(404) 
          }) 
 


          test('Should return 400 invalid UF', async () => {
               await request(sut.app)
               .put(`${ADDRESS_CRUD_BASE_ROUTE}/${address_to_update[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(MakeAddressBodyDto({uf:"invalid"}))
               .expect(400) 
          }) 

          test('Should return 200 ', async () => {
               await request(sut.app)
               .put(`${ADDRESS_CRUD_BASE_ROUTE}/${address_to_update[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(MakeAddressBodyDto())
               .expect(200) 
          })
     
     })

     describe('GET /addresses', () => {

          test('Should return 401 on missing or basic user', async () => {
               await request(sut.app).get(`${ADDRESS_CRUD_BASE_ROUTE}`)
               .set("Authorization", `Bearer ${sut.tokens.basic}`).send()
               .expect(401) 
          })

          test('Should return 200', async () => {
               await request(sut.app).get(`${ADDRESS_CRUD_BASE_ROUTE}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(200) 
               .expect(res=>{
                    expect(res.body).toMatchObject( sut.test_addresses )
               })
          }) 

         test('Should return 200', async () => {
               await request(sut.app).get(`${ADDRESS_CRUD_BASE_ROUTE}?v=labelview`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(200) 
               .expect(res=>{
                    expect(res.body).toEqual( sut.test_addresses.map(a=>(new AddressView(a).getLabelView())))
               })
          })  

     })

     describe('GET /addresses/:id', () => {
          test('Should return 401 on missing token', async () => {
               await request(sut.app).get(`${ADDRESS_CRUD_BASE_ROUTE}/${sut.test_addresses[0].id}`)
               .expect(401) 
          })

          test('Should return 400 if invalid params', async () => {
               await request(sut.app).get(`${ADDRESS_CRUD_BASE_ROUTE}/not_a_valid_id`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          }) 

          test('Should return 403 if non admin with no address related', async () => {
               await request(sut.app).get(`${ADDRESS_CRUD_BASE_ROUTE}/${sut.test_addresses[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.basic_token_noaddress}`)
               .expect(403) 
          })

          test('Should return 200', async () => {
               await request(sut.app).get(`${ADDRESS_CRUD_BASE_ROUTE}/${sut.test_addresses[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`)
               .expect(200) 
               .expect(res=>{
                    expect(res.body).toMatchObject( new AddressView(sut.test_addresses[0]))
               })
          })

          test('Should return 200 with label view', async () => {
               await request(sut.app).get(`${ADDRESS_CRUD_BASE_ROUTE}/${sut.test_addresses[0].id}?v=labelview`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`)
               .expect(200) 
               .expect(res=>{
                    expect(res.body).toMatchObject( new AddressView(sut.test_addresses[0]).getLabelView())
               })
          })

     }) 

     describe('DELETE /addresses/:id', () => {

          const address_to_remove = [ MakeFakeAddress()]
          beforeAll( async ()=>{
               await KnexAdapter.connection("addresses").insert(address_to_remove)
          })

          afterAll( async ()=>{
               await KnexAdapter.connection("addresses").delete().where({ id: address_to_remove[0].id})
          })
        
          test('Should return 401 on missing token', async () => {
               await request(sut.app).delete(`${ADDRESS_CRUD_BASE_ROUTE}/${address_to_remove[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.basic_token}`).send()
               .expect(401) 
          })
          test('Should return 400 if invalid params', async () => {
               await request(sut.app).delete(`${ADDRESS_CRUD_BASE_ROUTE}/not_a_valid_id`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          }) 

          test('Should return 404 if no address were found', async () => {
               await request(sut.app).delete(`${ADDRESS_CRUD_BASE_ROUTE}/${NIL}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`)
               .expect(404) 
          })


          test('Should return 204', async () => {
               await request(sut.app).delete(`${ADDRESS_CRUD_BASE_ROUTE}/${address_to_remove[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`)
               .expect(204) 
          })

     }) 

})