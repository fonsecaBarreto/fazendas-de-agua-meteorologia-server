
import { Address } from "../../../../domain/Entities/Address"
import { User } from "../../../../domain/Entities/User"
import { AddressNotFoundError } from "../../../../domain/Errors/AddressesErrors"
import { UserNameInUseError, UserNotFoundError, UserRoleIsInvalidError } from "../../../../domain/Errors/UsersErrors"
import { IAddressRepository } from "../../../../domain/Interfaces/repositories/IAddressRepository"
import { IUserRepository } from "../../../../domain/Interfaces/repositories/IUserRepository"
import { IUsersServices, UsersServices } from "../../../../domain/Services/Users/Users_Services"
import { UserView } from "../../../../domain/Views/UserView"
import { MakeFakeAddress } from "../../../mocks/entities/MakeAddress"
import { MakeFakeUser } from "../../../mocks/entities/MakeUser"
import { HasherStub, IdGeneratorStub  } from '../../../mocks/vendors/index'

const makeSut = () =>{
     
     const mocked_users = [
          MakeFakeUser(),
          MakeFakeUser()
     ]
     
     const mocked_addresses = [
          MakeFakeAddress()
     ]

     class UsersRepositoryStub implements IUserRepository {
          async findUser(id: string): Promise<UserView> {
               return new UserView(mocked_users[0])
          }

          async list(): Promise<User[]> {
              return mocked_users
          }
          async find(id: string): Promise<User> {
               return mocked_users[0]
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

     class AddressRepositoryStub implements Pick<IAddressRepository,'find' | 'relateUser'> {
          relateUser(user_id: string, address_id: string): Promise<boolean> {
               return Promise.resolve(true)
          }
          async find(id: string): Promise<Address> {
               return mocked_addresses[0]
          }
        

     }

     const usersRepository = new UsersRepositoryStub()
     const addressRepository = new AddressRepositoryStub()
     const idGenerator = new IdGeneratorStub();
     const hasher =  new HasherStub()

     const sut = new UsersServices( usersRepository, addressRepository, idGenerator, hasher)
     return { sut, idGenerator, hasher, usersRepository, addressRepository, mocked_users, mocked_addresses  }
  
}

const makeCreateUserParams = (params?: Partial<IUsersServices.Params.Create>): IUsersServices.Params.Create  =>{
     return {
          name:"Nome teste",
          password:"123456",
          role: 0,
          username: "NomeDeUsuarioTeste",
          address_id: undefined,
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

          test("Should not call addressRepository if no address_id were provided", async () =>{
               const { sut, addressRepository } = makeSut()
               const findAddSpy = jest.spyOn(addressRepository,'find')
               await sut.create(makeCreateUserParams({address_id: null}))
               expect(findAddSpy).toHaveBeenCalledTimes(0)
          })

          test("Should throw error if address_id were provided and addressRepository return null", async () =>{
               const { sut, addressRepository } = makeSut()
               const findAddSpy = jest.spyOn(addressRepository,'find').mockImplementationOnce(()=>{
                    return Promise.resolve(null)
               })
               const resp = sut.create(makeCreateUserParams({address_id: "any_address_id"}))
               await expect(resp).rejects.toThrow(new AddressNotFoundError())
               expect(findAddSpy).toHaveBeenCalledWith('any_address_id')
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

          
          test("Should call repository with correct values ", async () =>{
               const { sut, usersRepository } = makeSut()
               const addSpy = jest.spyOn(usersRepository, "upsert");
               const params = makeCreateUserParams()
               await sut.create(params)
               expect(addSpy).toHaveBeenCalledWith({
                    ...params,
                    id: "generated_id",
                    password:"hashed_password"
               })
          })  

          test("Should not call addressRepository relateUser if no address_id were provided", async () =>{
               const { sut, addressRepository } = makeSut()
               const addSpy = jest.spyOn(addressRepository, "relateUser");
               const params = makeCreateUserParams({address_id: null})
               await sut.create(params)
               expect(addSpy).toHaveBeenCalledTimes(0)
            
          })  

          test("Should call addressRepository relateUser if a address_id were provided", async () =>{
               const { sut, addressRepository, mocked_addresses } = makeSut()
               const addSpy = jest.spyOn(addressRepository, "relateUser");
               const params = makeCreateUserParams({address_id: "any_address_id"})
               const respo = await sut.create(params)
               expect(addSpy).toHaveBeenCalledWith('generated_id','any_address_id')
            
          })  

          test("Should return data", async () =>{
               const { sut } = makeSut()
               const params = makeCreateUserParams()
               const resp = await sut.create(params)
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
               const { sut, usersRepository, mocked_users } = makeSut()
               const addSpy = jest.spyOn(usersRepository, "upsert");
               
               const params = makeUpdateUserParams({username:"OutroUserName", 'name':"Um outro nome"})
               const resp = await sut.update('any_id',params)
               
               const final_user= {
                    ...mocked_users[0],
                    ...params
               }

               expect(addSpy).toHaveBeenCalledWith(final_user)
               expect(resp).toEqual( new UserView( { ...final_user }))
          })  
     })

     describe("find", () =>{
    
          test("Should return null if no user were found", async () =>{
               const { sut, usersRepository } = makeSut()
               jest.spyOn(usersRepository, "findUser").mockImplementationOnce(async () =>{
                    return null
               });
               const resp = await sut.find('invalid_id')
               await expect(resp).toBe(null)
            
          })

          test("Should return userView", async () =>{
               const { sut, mocked_users } = makeSut()
               const resp = await sut.find('valid_id')
               await expect(resp).toEqual( new UserView(mocked_users[0]))
          }) 

     })
 
     describe("list", () =>{
    
          test("Should return empty array if no address were found", async () =>{
               const { sut, usersRepository } = makeSut()
               jest.spyOn(usersRepository, "list").mockImplementationOnce(()=>{
                    return Promise.resolve([])
               })
               const resp = await sut.list()
               await expect(resp).toEqual([])
            
          })

          test("Should a array of addresses", async () =>{
               const { sut, mocked_users } = makeSut()
               const resp = await sut.list();
               await expect(resp).toEqual(mocked_users)
          }) 

     })

     describe("remove", () =>{
    
          test("Should throw error if repository return false", async () =>{
               const { sut, usersRepository } = makeSut()
               jest.spyOn(usersRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(false)
               })
               const resp = sut.remove('any_id')
               await expect(resp).rejects.toThrow(new UserNotFoundError())
            
          })

          test("Should return void if repository returns true", async () =>{
               const { sut, usersRepository } = makeSut()
               jest.spyOn(usersRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(true)
               })
               const resp = await sut.remove('any_id');
               expect(resp).toBe(undefined)
          }) 

     })
 
}) 