
import { User } from "../../../domain/Entities/User"
import { UserNameInUseError, UserNotFoundError, UserRoleIsInvalidError } from "../../../domain/Errors/UsersErrors"
import { IUserRepository } from "../../../domain/Interfaces/repositories/IUserRepository"
import { IUsersServices, UsersServices } from "../../../domain/Services/Users/Users_Services"
import { UserView } from "../../../domain/Views/UserView"
import { MakeFakeAddress } from "../../mocks/entities/MakeAddress"
import { MakeFakeUser } from "../../mocks/entities/MakeUser"

import { HasherStub, IdGeneratorStub  } from '../../mocks/vendors/index'

const makeSut = () =>{
     
     const mockedFakeUser = [
          MakeFakeUser(),
          MakeFakeUser()
     ]

     class UsersRepositoryStub implements IUserRepository {
          async findUser(id: string): Promise<UserView> {
               return new UserView(MakeFakeUser({}))
          }

          async list(): Promise<User[]> {
              return mockedFakeUser
          }
          async find(id: string): Promise<User> {
               return mockedFakeUser[0]
          }
          async remove(id: string): Promise<boolean> {
               return true
          }
          async upsert(model: User): Promise<void> {
               return null
          }

          async findByUsername(username: string): Promise<User> {
               return null
          }
 
     }

     const usersRepository = new UsersRepositoryStub()
     const idGenerator = new IdGeneratorStub();
     const hasher =  new HasherStub()

     const sut = new UsersServices( usersRepository, idGenerator, hasher)
     return { sut, idGenerator, hasher, usersRepository, mockedFakeUser  }
  
}

const makeCreateUserParams = (params?: Partial<IUsersServices.Params.Create>): IUsersServices.Params.Create  =>{
     return {
          name:"Nome teste",
          password:"123456",
          role: 0,
          username: "NomeDeUsuarioTeste",
          ...params
     }
}


const makeUpdateUserParams = (params?: Partial<IUsersServices.Params.Update>): IUsersServices.Params.Update  =>{
     return {
          name:"Nome teste",
          username: "NomeDeUsuarioTeste",
          ...params
     }
}

describe("CreateUser Services", () =>{
     describe("create", () =>{

          test("Should throw error if role is outside of range", async () =>{
               const { sut } = makeSut()
               const resp = sut.create(makeCreateUserParams({role: 3}))
               await expect(resp).rejects.toThrow(new UserRoleIsInvalidError())
          })

          test("Should throw error if repository returns user with the same username", async () =>{
               const { sut,usersRepository } = makeSut()

               jest.spyOn(usersRepository, 'findByUsername').mockImplementationOnce(async ()=>{
                    return MakeFakeUser({ username:"sameUsername" })
               });

               const resp = sut.create(makeCreateUserParams({ username:"sameUsername" }))
               await expect(resp).rejects.toThrow(new UserNameInUseError())

          })

          test("Should call id Generator once", async () =>{
               const { sut, idGenerator } = makeSut()
               const spy = jest.spyOn(idGenerator, 'gen')
               await sut.create(makeCreateUserParams({}))
               expect(spy).toHaveBeenCalledTimes(1)
          })

          test("Should call hasher with correct values ", async () =>{
               const { sut, hasher } = makeSut()
               const spy = jest.spyOn(hasher, 'hash')
               await sut.create(makeCreateUserParams({password:"teste123"}))
               expect(spy).toHaveBeenCalledTimes(1)
               expect(spy).toHaveBeenCalledWith("teste123")
          })

          
          test("Should call repository with correct values and return data", async () =>{
               const { sut, usersRepository } = makeSut()
               const addSpy = jest.spyOn(usersRepository, "upsert");
               
               const params = makeCreateUserParams()
               const resp = await sut.create(params)
               
               expect(addSpy).toHaveBeenCalledWith({
                    ...params,
                    id: "generated_id",
                    password:"hashed_password"
               })
     
               expect(resp).toEqual( new UserView( {  ...params,   id: "generated_id" }))
               
          })  
     })


     describe("update", () =>{

          test("Should throw user were not found", async () =>{
               const { sut, usersRepository } = makeSut()

               jest.spyOn(usersRepository, 'find').mockImplementationOnce(async ()=>{
                    return null
               });

               const resp = sut.update('invalid_id',makeUpdateUserParams())
               await expect(resp).rejects.toThrow(new UserNotFoundError())
          })

         test("Should throw error if repository returns a different user with the same username ", async () =>{
               const { sut,usersRepository } = makeSut()

               jest.spyOn(usersRepository, 'findByUsername').mockImplementationOnce(async ()=>{
                    return MakeFakeUser({ username:"sameUsername", id: "different_id" })
               });

               const resp = sut.update('any_id',makeUpdateUserParams({ username:"sameUsername" }))
               await expect(resp).rejects.toThrow(new UserNameInUseError())

          })
          
          test("Should call repository with correct values and return data", async () =>{
               const { sut, usersRepository, mockedFakeUser } = makeSut()
               const addSpy = jest.spyOn(usersRepository, "upsert");
               
               const params = makeUpdateUserParams({username:"OutroUserName", 'name':"Um outro nome"})
               const resp = await sut.update('any_id',params)
               
               const final_user= {
                    ...mockedFakeUser[0],
                    ...params
               }

               expect(addSpy).toHaveBeenCalledWith(final_user)
               expect(resp).toEqual( new UserView( { ...final_user }))
          })  
     })

     describe("find", () =>{
    
          test("Should return null if no user were found", async () =>{
               const { sut, usersRepository } = makeSut()
               jest.spyOn(usersRepository, "find").mockImplementationOnce(async () =>{
                    return null
               });
               const resp = await sut.find('invalid_id')
               await expect(resp).toBe(null)
            
          })

          test("Should return userView", async () =>{
               const { sut, mockedFakeUser } = makeSut()
               const resp = await sut.find('valid_id')
               await expect(resp).toEqual( new UserView({ ...mockedFakeUser[0]}))
          }) 

     })
 
     describe("AddressesServices.list", () =>{
    
          test("Should return empty array if no address were found", async () =>{
               const { sut, usersRepository } = makeSut()
               jest.spyOn(usersRepository, "list").mockImplementationOnce(()=>{
                    return Promise.resolve([])
               })
               const resp = await sut.list()
               await expect(resp).toEqual([])
            
          })

          test("Should a array of addresses", async () =>{
               const { sut, mockedFakeUser } = makeSut()
               const resp = await sut.list();
               await expect(resp).toEqual(mockedFakeUser)
          }) 

     })

     describe("AddressesServices.remove", () =>{
    
          test("Should throw error if repository return false", async () =>{
               const { sut, usersRepository } = makeSut()
               jest.spyOn(usersRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(false)
               })
               const resp = sut.remove('any_id')
               await expect(resp).rejects.toThrow(new UserNotFoundError())
            
          })

          test("Should return void if repository retyrn true", async () =>{
               const { sut, usersRepository } = makeSut()
               jest.spyOn(usersRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(true)
               })
               const resp = await sut.remove('any_id');
               expect(resp).toBe(undefined)
          }) 

     })
 
}) 