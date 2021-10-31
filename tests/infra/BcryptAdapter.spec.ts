import { BcryptAdapter } from '../../src/infra/BcryptAdapter'
import { compareSync, hashSync } from 'bcrypt'

const makeSut = () =>{
      const sut = new BcryptAdapter()
      return sut
}

describe("BcryptAdapter", () =>{
     test('Should hash a value', () =>{
          const sut = makeSut()
          const hashed =  sut.hash('some_value')
          const matchs = compareSync('some_value',hashed)
          expect(matchs).toBe(true)
     })

    test('Should return false id defferent values', () =>{
          const sut = makeSut()
          const hashed = hashSync('123',12)
          const matchs = sut.compare('some_value', hashed)
          expect(matchs).toBe(false)
     })

     test('Should return true if same values', () =>{
          const sut = makeSut()
          const hashed = hashSync('some_value',12)
          const matchs = sut.compare('some_value', hashed)
          expect(matchs).toBe(true)
     })

})