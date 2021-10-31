
import request from 'supertest'
import { NIL } from 'uuid';
import MakeTestEnv, { CloseEnv, MainTestEnv } from './env_setup'
import KnexAdapter from '@/infra/db/KnexAdapter'

import { MakeCreateUserBodyDto, MakeUpdateUserBodyDto } from '@/tests/mocks/dtos/MakeUsersDtos'
import { MakeFakeUser } from '@/tests/mocks/entities';
import { AddressView, UserView } from '@/domain/Views';

const USERS_CRUD_BASE_ROUTE = "/api/v1/users"

export var sut: MainTestEnv;
describe('Users Routes', () => {
     beforeAll(async () => { sut = await MakeTestEnv() })
     afterAll(async () => { await CloseEnv() })
     describe('POST /users', () => {
          const user_to_create = MakeCreateUserBodyDto({ username: "to_be_created_user" });
          afterAll( async ()=>{ await KnexAdapter.connection("users").delete().where({ username: user_to_create.username })})

          test('Should return 401 on missing token or basic user', async () => {
               await request(sut.app)
               .post(USERS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.basic}`).send()
               .expect(401) 
          })

          test('Should return 400 on invalid body', async () => {
               await request(sut.app)
               .post(USERS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          })

          test('Should return 403 if invalid role', async () => {
               await request(sut.app)
               .post(USERS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(
                    MakeCreateUserBodyDto({role: -1})
               )
               .expect(403) 
          })

          test('Should return 403 if in use username', async () => {
               await request(sut.app)
               .post(USERS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(
                    MakeCreateUserBodyDto({username: sut.test_users[0].username })
               )
               .expect(403) 
          })

          test('Should return 404 if unknown address', async () => {
               await request(sut.app)
               .post(USERS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(
                    MakeCreateUserBodyDto({username: sut.test_users[0].username, address_id:NIL })
               )
               .expect(404) 
          })

          test('Should return 200 ', async () => {
               await request(sut.app)
               .post(USERS_CRUD_BASE_ROUTE)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(user_to_create)
               .expect(200) 
          })  
     
     })
     describe('PUT /users/:id', () => {
          const users_to_update = [ MakeFakeUser()]
          beforeAll( async ()=>{
               await KnexAdapter.connection("users").insert(users_to_update)
          })
          afterAll( async ()=>{
               await KnexAdapter.connection("users").delete().where({ id: users_to_update[0].id})
          })
          test('Should return 401 on missing token or basic user', async () => {
               await request(sut.app)
               .put(`${USERS_CRUD_BASE_ROUTE}/${users_to_update[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.basic}`).send()
               .expect(401) 
          })

          test('Should return 400 if invalid params', async () => {
               await request(sut.app)
               .put(`${USERS_CRUD_BASE_ROUTE}/not_a_valid_id`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          })

          test('Should return 400 on invalid body', async () => {
               await request(sut.app)
               .put(`${USERS_CRUD_BASE_ROUTE}/${users_to_update[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send({})
               .expect(400) 
          })

          test('Should return 404 ', async () => {
               await request(sut.app)
               .put(`${USERS_CRUD_BASE_ROUTE}/${NIL}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(MakeUpdateUserBodyDto())
               .expect(404) 
          }) 

          test('Should return 403 if in use username', async () => {
               await request(sut.app)
               .put(`${USERS_CRUD_BASE_ROUTE}/${users_to_update[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(
                    MakeUpdateUserBodyDto({username: sut.test_users[0].username })
               )
               .expect(403) 
          })
          test('Should return 200 ', async () => {
               await request(sut.app)
               .put(`${USERS_CRUD_BASE_ROUTE}/${users_to_update[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send(MakeUpdateUserBodyDto())
               .expect(200) 
          }) 
     
     })
     describe('GET /users', () => {

          test('Should return 401 on missing or basic user', async () => {
               await request(sut.app).get(`${USERS_CRUD_BASE_ROUTE}`)
               .set("Authorization", `Bearer ${sut.tokens.basic}`).send()
               .expect(401) 
          })

          test('Should return 200', async () => {
               await request(sut.app).get(`${USERS_CRUD_BASE_ROUTE}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(200) 
               .expect(res=>{
                    expect(res.body).toMatchObject( sut.test_users )
               })
          }) 
     })
     describe('GET /users/:id', () => {
          test('Should return 401 on missing token', async () => {
               await request(sut.app).get(`${USERS_CRUD_BASE_ROUTE}/${sut.test_users[0].id}`)
               .expect(401) 
          })

          test('Should return 400 if invalid params', async () => {
               await request(sut.app).get(`${USERS_CRUD_BASE_ROUTE}/not_a_valid_id`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          }) 

          test('Should return 204 if unknow if', async () => {
               await request(sut.app).get(`${USERS_CRUD_BASE_ROUTE}/${NIL}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`)
               .expect(204) 

          })

          test('Should return 200', async () => {
               await request(sut.app).get(`${USERS_CRUD_BASE_ROUTE}/${sut.test_users[1].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`)
               .expect(200) 
               .expect(res=>{
                    expect(res.body).toMatchObject( { ...new UserView(sut.test_users[1], null), address: new AddressView(sut.test_addresses[0]).getLabelView() })
               })
          }) 

     }) 

     describe('DELETE /users/:id', () => {

          const users_toRemove = [ MakeFakeUser()]
          beforeAll( async ()=>{
               await KnexAdapter.connection("users").insert(users_toRemove)
          })

          afterAll( async ()=>{
               await KnexAdapter.connection("users").delete().where({ id: users_toRemove[0].id})
          })
        
          test('Should return 401 on missing admin token', async () => {
               await request(sut.app).delete(`${USERS_CRUD_BASE_ROUTE}/${users_toRemove[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.basic_token}`).send()
               .expect(401) 
          })
          test('Should return 400 if invalid params', async () => {
               await request(sut.app).delete(`${USERS_CRUD_BASE_ROUTE}/not_a_valid_id`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(400) 
          }) 

          test('Should return 404 if no user were found', async () => {
               await request(sut.app).delete(`${USERS_CRUD_BASE_ROUTE}/${NIL}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`)
               .expect(404) 
          })


          test('Should return 204', async () => {
               await request(sut.app).delete(`${USERS_CRUD_BASE_ROUTE}/${users_toRemove[0].id}`)
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`)
               .expect(204) 
          })

     })  

})