
import { Address } from "../../../src/domain/Entities/Address"
import { AddressesServices, IAddressesServices } from "../../../src/domain/Services/Addresses/Addresses_Services"
import { AddressNotFoundError, AddressUfInvalidError } from "../../../src/domain/Errors/AddressesErrors"
import { IAddressRepository } from "../../../src/domain/Interfaces/repositories/IAddressRepository"
import { MakeFakeAddress } from "../../mocks/entities/MakeAddress"
import { IdGeneratorStub } from "../../mocks/vendors/IdGeneratorStub"
import { MakeFakeUser } from "../../mocks/entities/MakeUser"
import { UserNotAllowedError, UserNotFoundError } from "../../../src/domain/Errors/UsersErrors"
import { UserView } from "../../../src/domain/Views/UserView"
import { AddressView } from "../../../src/domain/Views/AddressView"
import { MakeFakeStation } from "../../mocks/entities/MakeStation"

const makeSut = () =>{
     
     const fakeAddresses =[ MakeFakeAddress()]
     const fakeStations = [ MakeFakeStation() ]

     class AddressRepositoryStub implements Omit<IAddressRepository,'isUserRelated'> {
          async findAddress(id: string): Promise<AddressView> {
               return new AddressView(fakeAddresses[0], fakeStations)
          }

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

     const addressRepository = new AddressRepositoryStub
     const idGenerator = new IdGeneratorStub();

     const sut = new AddressesServices(addressRepository, idGenerator)
     return { sut, idGenerator, addressRepository, fakeAddresses, fakeStations }
  
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

         /*  test("Should throw error if no user were found", async () =>{
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
          }) */

          test("Should throw error if repository return false", async () =>{
               const { sut, addressRepository } = makeSut()
               jest.spyOn(addressRepository, 'relateUser').mockImplementationOnce(async ()=>{
                    return false
               })
               const resp = sut.appendUserToAddress({ user: new UserView(MakeFakeUser()), address: MakeFakeAddress()})
               await expect(resp).rejects.toThrow(new UserNotAllowedError())
          })

          test("Should set Address to the userView", async () =>{
               const { sut } = makeSut()
               const usuario = new UserView(MakeFakeUser())
               const address = MakeFakeAddress();
               const resp = await sut.appendUserToAddress({ user: usuario , address })
               expect(resp).toBeNull()
               expect(usuario.address).toEqual(address)
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

          test("Should call repository with correct values", async () =>{
               const { sut, addressRepository } = makeSut()
               const addSpy = jest.spyOn(addressRepository, "upsert");
               const params =  makeCreateAddressParams()

               const resp = await sut.create(params)
               expect(addSpy).toHaveBeenCalledWith({
                    ...params,
                    id: "generated_id",
               })
          })
          test("Should call repository with correct values and return data", async () =>{
               const { sut, addressRepository } = makeSut()
               const addSpy = jest.spyOn(addressRepository, "upsert");
               const params =  makeCreateAddressParams()

               const resp = await sut.create(params)
               expect(resp).toEqual(new AddressView({ ...params, id: "generated_id" }))
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

          test("Should call repository with correct values", async () =>{
               const { sut, addressRepository } = makeSut()
               const addSpy = jest.spyOn(addressRepository, "upsert");
               const address =  makeCreateAddressParams()
               const resp = await sut.update('any_id',address)
               expect(addSpy).toHaveBeenCalledWith({ id:'any_id', ...address })
               expect(resp).toBeTruthy()
          }) 

          test("Should return correct data", async () =>{
               const { sut, addressRepository } = makeSut()
               const address =  makeCreateAddressParams()
               const resp = await sut.update('any_id',address)
               expect(resp).toEqual( new AddressView({ id:'any_id', ...address }))
          })   
     })

     describe("AddressesServices.find", () =>{
    
          test("Should return null if no address were found", async () =>{
               const { sut, addressRepository } = makeSut()
               jest.spyOn(addressRepository, "findAddress").mockImplementationOnce(async () =>{
                    return null
               });
               const resp = await sut.find('invalid_id')
               await expect(resp).toBe(null)
            
          })

          test("Should return addressView", async () =>{
               const { sut, fakeAddresses, fakeStations } = makeSut()
               const resp = await sut.find('valid_id')
               await expect(resp).toEqual(new AddressView(fakeAddresses[0], fakeStations ))
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