import { User } from "@/domain/Entities"
import { UserView } from "@/domain/Views/UserView"
import { IUserRepository } from "@/domain/Interfaces"
import { AuthenticationServices } from '@/domain/Services/Users/Authentication_Services'

import { MakeFakeUser } from "@/tests/mocks/entities/"
import { HasherStub, EncrypterStub} from '@/tests/mocks/vendors'


const makeSut = () =>{

     class UsersRepositoryStub implements Pick<IUserRepository, "findUser" | "findByUsername"> {

          async findByUsername(username: string): Promise<User> {
               return MakeFakeUser({ id:"id_authentication_test", password:"hashed_password"})
          }
          async findUser(id: string): Promise<UserView> {
               return new UserView(MakeFakeUser())
          }
     }

     const usersRepository = new UsersRepositoryStub
     const encrypter = new EncrypterStub();
     const hasher =  new HasherStub()

     const sut = new AuthenticationServices(usersRepository,hasher, encrypter)
     return { sut, encrypter, hasher, usersRepository}

}

describe("AuthenticationServices", () =>{
     describe("generateToken", () =>{


          test("Should return null if user wasnt found", async () =>{
               const { sut, usersRepository } = makeSut()
               const spy = jest.spyOn(usersRepository, 'findByUsername').mockImplementationOnce(async ()=> null)

               const resp = await sut.generateToken({username:"any_username",password:"any_password"})
               expect(resp).toBe(null)
               expect(spy).toHaveBeenCalledWith('any_username')
          
          })

          test("Should return null if password doest match", async () =>{
               const { sut, hasher} = makeSut()
               const spy = jest.spyOn(hasher, 'compare').mockImplementationOnce( ()=> false)
               const resp = await sut.generateToken({username:"any_username",password:"any_password"})
               expect(resp).toBe(null)
               expect(spy).toHaveBeenCalledWith('any_password','hashed_password')
          
          })


          test("Should return null if encrypter throws ", async () =>{
               const { sut, encrypter} = makeSut()
               const spy = jest.spyOn(encrypter, 'sign').mockImplementationOnce( async ()=> { throw new Error("qualquer error")})
               const resp = await sut.generateToken({username:"any_username",password:"any_password"})
               expect(resp).toBe(null)
               expect(spy).toHaveBeenCalledWith({
                    id: 'id_authentication_test',
                    username: "any_username"
               })
          })

          test("Should return a accessToken", async () =>{
               const { sut } = makeSut()
               const resp = await sut.generateToken({username:"any_username",password:"any_password"})
               expect(resp).toBe("generated_access_token")
               
          })

     })

     describe("verifyToken", () =>{

          test("Should return null if encrypter throws", async () =>{

               const { sut, encrypter } = makeSut()
               const spy = jest.spyOn(encrypter, 'verify').mockImplementationOnce(async()=>{
                    throw new Error("Error qualquer")
               })

               const resp = await sut.verifyToken("any_token");
               expect(resp).toBe(null)

               expect(spy).toHaveBeenCalledWith('any_token')
          
          })

          test("Should return null if encrypter return null", async () =>{

               const { sut, encrypter } = makeSut()
               const spy = jest.spyOn(encrypter, 'verify').mockImplementationOnce(async()=>{
                    return null
               })

               const resp = await sut.verifyToken("any_token");
               expect(resp).toBe(null)

               expect(spy).toHaveBeenCalledWith('any_token')
          
          })

          test("Should call return user", async () =>{
           
               const { sut, usersRepository, encrypter} = makeSut()
               const usuarioDoRepository = MakeFakeUser({ id: "usuario_id"})

               const spy = jest.spyOn(usersRepository, 'findUser').mockImplementationOnce( async ()=>{
                    return new UserView(usuarioDoRepository)
               })

               const resp = await sut.verifyToken("any_token");

               expect(spy).toHaveBeenCalledWith('usuario_id')
               expect(resp).toEqual(new UserView(usuarioDoRepository)
               )

          })

     })


}) 