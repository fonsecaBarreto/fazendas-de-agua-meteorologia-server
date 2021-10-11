
import { Address } from "../../../domain/Entities/Address"
import { AddressesServices, IAddressesServices } from "../../../domain/Services/Addresses/Addresses_Services"
import { AddressNotFoundError, AddressUfInvalidError } from "../../../domain/Errors/AddressesErrors"

import { IIdGenerator } from "../../../domain/Interfaces/IIdGenerator"
import { IAddressRepository } from "../../../domain/Interfaces/repositories/IAddressRepository"

import { MakeFakeAddress } from "../../mocks/entities/MakeAddress"
import { IdGeneratorStub } from "../../mocks/vendors/IdGeneratorStub"
import { IUserRepository } from "../../../domain/Interfaces"
import { User } from "../../../domain/Entities/User"
import { MakeFakeUser } from "../../mocks/entities/MakeUser"
import { UserNotAllowedError, UserNotFoundError } from "../../../domain/Errors/UsersErrors"


const makeSut = () =>{
     
     const fakeAddresses =[ MakeFakeAddress()]

     class AddressRepositoryStub implements IAddressRepository {

          async relateUser(user_id: string, address_id: string): Promise<boolean> {
               return true
          }

          async upsert(address: Address): Promise<void> {
               return null
          }

          list(): Promise<Address[]> {
               return Promise.resolve(fakeAddresses)
          }
          async find(id: string): Promise<Address> {
               return fakeAddresses[0]
          }
          remove(id: string): Promise<boolean> {
               return Promise.resolve(true)
          }

     }

     class UsersRepositoryStub implements Pick<IUserRepository,'find'> {
          async find(id: string): Promise<User> {
              return MakeFakeUser()
          }
     }

     const addressRepository = new AddressRepositoryStub
     const usersRepository = new UsersRepositoryStub()
     const idGenerator = new IdGeneratorStub();

     const sut = new AddressesServices(addressRepository, usersRepository, idGenerator)
     return { sut, idGenerator, addressRepository, usersRepository, fakeAddresses}
  
}


const makeCreateAddressParams = (fields?: Partial<IAddressesServices.Params.Create>): IAddressesServices.Params.Create =>{
     return {
          city: "Rio das Ostras",
          details: "sobrado",
          number: '456 - Test',
          postalCode: "00000000",
          region: "Liberdade",
          street: "Rua das laranjeiras",
          uf: 'SP',
          ...fields
     }
}

describe("Addresses Services", () =>{


     describe("AddressesServices.appendUserToAddress", () =>{

          test("Should throw error if no user were found", async () =>{
               const { sut, usersRepository } = makeSut()
               jest.spyOn(usersRepository, 'find').mockImplementationOnce(async ()=>{
                    return null
               })
               const resp = sut.appendUserToAddress({user_id:"invalid_user", address_id:"any_id"})
               await expect(resp).rejects.toThrow(new UserNotFoundError())
          })

          test("Should throw error if no address were found", async () =>{
               const { sut, addressRepository } = makeSut()
               jest.spyOn(addressRepository, 'find').mockImplementationOnce(async ()=>{
                    return null
               })
               const resp = sut.appendUserToAddress({user_id:"any_id", address_id:"invalid_address_id"})
               await expect(resp).rejects.toThrow(new AddressNotFoundError())
          })

          test("Should throw error if repository return false", async () =>{
               const { sut, addressRepository } = makeSut()
               jest.spyOn(addressRepository, 'relateUser').mockImplementationOnce(async ()=>{
                    return false
               })
               const resp = sut.appendUserToAddress({user_id:"any_id", address_id:"address_id"})
               await expect(resp).rejects.toThrow(new UserNotAllowedError())
          })

          test("Should return null if everything went fine", async () =>{
               const { sut } = makeSut()
               const resp = await sut.appendUserToAddress({user_id:"any_id", address_id:"address_id"})
               expect(resp).toBe(null)
          })

       
     })
     describe("AddressesServices.create", () =>{

          test("Should throw error if 'uf' doesnt exists", async () =>{
               const { sut } = makeSut()
               const resp = sut.create(makeCreateAddressParams({ uf: 'invalid_uf' }))
               await expect(resp).rejects.toThrow(new AddressUfInvalidError())
          })

          test("Should call id Generator once", async () =>{
               const { sut, idGenerator } = makeSut()
               const spy = jest.spyOn(idGenerator, "gen");
               await sut.create(makeCreateAddressParams())
               expect(spy).toHaveBeenCalledTimes(1)
          })

          test("Should call repository with correct values and return data", async () =>{
               const { sut, addressRepository } = makeSut()
               const addSpy = jest.spyOn(addressRepository, "upsert");
               const params =  makeCreateAddressParams()

               const resp = await sut.create(params)
               expect(addSpy).toHaveBeenCalledWith({
                    ...params,
                    id: "generated_id",
               })
               expect(resp).toBeTruthy()
               expect(resp).toEqual({
                    ...params,
                    id: "generated_id",
               })
          })
     })

     describe("AddressesServices.update", () =>{


          test("Should throw error if repository doenst find the address", async () =>{
               const { sut, addressRepository } = makeSut()
               const spy = jest.spyOn(addressRepository, 'find').mockImplementationOnce(async ()=>{
                    return null
               })
               const resp = sut.update('id_invalido', makeCreateAddressParams())
               await expect(resp).rejects.toThrow(new AddressNotFoundError())  
               expect(spy).toHaveBeenCalledWith('id_invalido')
          })

          test("Should throw error if 'uf' doesnt exists", async () =>{
               const { sut } = makeSut()
               const resp = sut.update('any_id',makeCreateAddressParams({'uf': "invalid_address"}))
               await expect(resp).rejects.toThrow(new AddressUfInvalidError())
          })

          test("Should not call id Generator", async () =>{
               const { sut, idGenerator } = makeSut()
               const spy = jest.spyOn(idGenerator, "gen");
               await sut.update('any_id',makeCreateAddressParams())
               expect(spy).toHaveBeenCalledTimes(0)
          })

          test("Should call repository with correct values and return data", async () =>{
               const { sut, addressRepository } = makeSut()
               const addSpy = jest.spyOn(addressRepository, "upsert");
               const address =  makeCreateAddressParams()

               const resp = await sut.update('any_id',address)
               expect(addSpy).toHaveBeenCalledWith({
                    id:'any_id',
                    ...address,
               })
               expect(resp).toBeTruthy()
               expect(resp).toEqual({
                    id:'any_id',
                    ...address,
               })
          }) 
     })

     describe("AddressesServices.find", () =>{
    
          test("Should return null if no address were found", async () =>{
               const { sut, addressRepository } = makeSut()
               jest.spyOn(addressRepository, "find").mockImplementationOnce(async () =>{
                    return null
               });
               const resp = await sut.find('invalid_id')
               await expect(resp).toBe(null)
            
          })

          test("Should a address", async () =>{
               const { sut, fakeAddresses } = makeSut()
               const resp = await sut.find('valid_id')
               await expect(resp).toEqual(fakeAddresses[0])
          }) 

     })

     describe("AddressesServices.list", () =>{
    
          test("Should return empty array if no address were found", async () =>{
               const { sut, addressRepository } = makeSut()
               jest.spyOn(addressRepository, "list").mockImplementationOnce(()=>{
                    return Promise.resolve([])
               })
               const resp = await sut.list()
               await expect(resp).toEqual([])
            
          })

          test("Should a array of addresses", async () =>{
               const { sut, fakeAddresses } = makeSut()
               const resp = await sut.list();
               await expect(resp).toEqual(fakeAddresses)
          }) 

     })

     describe("AddressesServices.remove", () =>{
    
          test("Should throw error if repository return false", async () =>{
               const { sut, addressRepository } = makeSut()
               jest.spyOn(addressRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(false)
               })
               const resp = sut.remove('any_id')
               await expect(resp).rejects.toThrow(new AddressNotFoundError())
            
          })

          test("Should return void if repository retyrn true", async () =>{
               const { sut, addressRepository } = makeSut()
               jest.spyOn(addressRepository, "remove").mockImplementationOnce((id:string)=>{
                    return Promise.resolve(true)
               })
               const resp = await sut.remove('any_id');
               expect(resp).toBe(undefined)
          }) 

     })

}) 