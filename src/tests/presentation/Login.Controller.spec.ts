import { AuthUserController, SignInUserController } from '../../presentation/Controllers/V1/Public/Login.Controllers'

import { AuthenticationServices } from '../../domain/Services/Users/Authentication_Services'

import { IUserRepository } from '../../domain/Interfaces/repositories/IUserRepository'

import { Request } from '../../presentation/Protocols/Http'

import { BadRequest, Forbidden, Ok, Unauthorized } from '../../presentation/Protocols/http-helper'
import { AddressNotFoundError, AddressUfInvalidError } from '../../domain/Errors/AddressesErrors'

import { User } from '../../domain/Entities/User'

import { EncrypterStub } from '../mocks/vendors/EncrypterStub'
import { HasherStub } from '../mocks/vendors/HasherStub'
import { MakeFakeUser } from '../mocks/entities/MakeUser'

import { MakeRequest } from './mocks/MakeRequest'
import { UserView } from '../../domain/Views/UserView'

const makeSut = () =>{

     class usersRepositoryStub implements Pick<IUserRepository, "findUser" | "findByUsername"> {
          async findUser(id: string): Promise<UserView> {
               return new UserView(MakeFakeUser())
          }
          async findByUsername(username: string): Promise<User> {
               return MakeFakeUser()
          }
     }

     const usersRepository = new usersRepositoryStub()
     const encrypter = new EncrypterStub()
     const hasher = new HasherStub()
     const authenticationServices = new AuthenticationServices(usersRepository,hasher, encrypter);

     const signin = new SignInUserController(authenticationServices)
     const auth = new AuthUserController()

     return { signin, auth, usersRepository, encrypter, hasher, authenticationServices }
}


const MakeSignInParams = (params?: Partial<AuthenticationServices.GenerateTokenParams>): AuthenticationServices.GenerateTokenParams =>{
     return (
     {
          username: "usuario_test",
          password: "123456",
          ...params
     })
}


describe("CreateAddressController", () =>{

     describe("signin", () =>{

          test("Shoudl call generatetoken with correct values", async () =>{
               const { signin, authenticationServices } = makeSut()
               const spy = jest.spyOn(authenticationServices, 'generateToken')
               const req = MakeRequest({body:MakeSignInParams({ username:"usuario_test", password:"password_test" })})
               await signin.handler(req)
               expect(spy).toHaveBeenCalledWith({ username:"usuario_test", password:"password_test" })
          })
          
          test("Should return 401 if no token were returned", async () =>{
               const { signin, authenticationServices } = makeSut()
               jest.spyOn(authenticationServices, 'generateToken').mockImplementationOnce(async ()=>{
                    return null
               })
               
               const req = MakeRequest({body:MakeSignInParams({ username:"usuario_test", password:"password_test" })})
               const res = await signin.handler(req)
               
               expect(res).toEqual(Unauthorized())
          })

          test("Should return status 200 ", async () =>{
               
               const { signin } = makeSut()
               
               const req = MakeRequest({body:MakeSignInParams({ username:"usuario_test", password:"password_test" })})
               const res = await signin.handler(req);
               
               expect(res).toEqual(Ok({"accessToken": "generated_access_token"}))
               
          }) 
     })

})