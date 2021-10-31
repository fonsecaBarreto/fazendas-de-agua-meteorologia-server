import { JsonWebTokenAdapter } from '../../src/infra/JsonWebTokenAdapter'
import jwt from 'jsonwebtoken'

const makeSut = () =>{
      const sut = new JsonWebTokenAdapter('secret')
      return sut
}

describe("BcryptAdapter", () =>{

     describe("sign", () =>{

          test('Should return null if jwt throw error', async () =>{
               const sut = makeSut()
               jest.spyOn(jwt,'sign').mockImplementationOnce(async ()=>{
                    throw new Error('Qualquer error')
               })
               const respo = await sut.sign("qualquer_valor")
               expect(respo).toBe(null)
               
          })
          test('Should return a valid encoded token', async() =>{
               const sut = makeSut()
               const payload = { id: "id_usuario" }
               const respo = await sut.sign(payload)
               expect(respo).toBeTruthy()
               await expect(jwt.verify(respo,'secret')).toMatchObject(payload)
               
          })
     })
     describe("verify", () =>{
          test('Should return a decoed token', async () =>{
               const sut = makeSut()
               const payload = { id: "id_usuario" }
               const token = await jwt.sign(payload,'secret')
               const respo = await sut.verify(token)
               expect(respo).toMatchObject(payload) 
          })
     
     })


})