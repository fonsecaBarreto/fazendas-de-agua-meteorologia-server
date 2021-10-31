import request from 'supertest'
import jwt from 'jsonwebtoken'
import { UserView } from '../../src/domain/Views/UserView'
import { v4 } from 'uuid'
import  MakeTestEnv, { CloseEnv, MainTestEnv } from './env_setup'

export var sut: MainTestEnv;

describe('Login Routes', () => {
     beforeAll(async () => { sut = await MakeTestEnv() })
     afterAll(async () => {   await CloseEnv()  })

     describe('POST /login/signin', () => {
          test('Should return 200 ', async () => {
               await request(sut.app)
               .post('/api/v1/login/signin')
               .send({ username: 'admin_test', password: '12345678' })
               .expect(200) 
          })
     
         test('Should return 401', async () => {
          await request(sut.app)
               .post('/api/v1/login/signin')
               .send({
                    username: 'invalid_userame',
                    password: '123456'
               })
               .expect(401)
          }) 
     })

      describe('POST /login/auth', () => {
          test('Should return 200 ', async () => {
               await request(sut.app)
               .post('/api/v1/login/auth')
               .set("Authorization", `Bearer ${sut.tokens.admin_token}`).send()
               .expect(200) 
               .expect((res) => {
                    expect(res.body).toMatchObject(new UserView(sut.test_users[0], null))
               })
          })
          test('Should return 401 if missing token', async () => {
               await request(sut.app).post('/api/v1/login/auth').send().expect(401)  
          })
          test('Should return 401 if invalid token', async () => {
               const token = await jwt.sign({ id: v4()}, sut.keys.JWT_SECRET)
               await request(sut.app).post('/api/v1/login/auth')
               .set("Authorization", `Bearer ${token}`)
               .send().expect(401)  
          })
     }) 
})