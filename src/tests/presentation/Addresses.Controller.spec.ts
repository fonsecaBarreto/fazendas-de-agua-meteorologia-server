import { CreateAddressController, FindAddresController, RemoveAddresController, UpdateAddressController } from '../../presentation/Controllers/V1/Addresses.Controller'
import { IAddressesServices } from '../../domain/Services/Addresses/Addresses_Services'
import { Address } from '../../domain/Entities/Address'
import { Request } from '../../presentation/Protocols/Http'
import { BadRequest, Forbidden, NotFound, Ok } from '../../presentation/Protocols/http-helper'
import { AddressNotFoundError, AddressUfInvalidError } from '../../domain/Errors/AddressesErrors'
import { MakeFakeAddress } from '../mocks/entities/MakeAddress'
import { MakeRequest } from './mocks/MakeRequest'

const makeSut = () =>{

     const fake_addresses = [
          MakeFakeAddress()
     ]
    class AddressesServicesStub implements IAddressesServices{

         async create(params: IAddressesServices.Params.Create): Promise<Address> {
              return MakeFakeAddress()
         }
         async update(id: string, address: IAddressesServices.Params.Create): Promise<Address> {
               return MakeFakeAddress()
         }
         find(id: string): Promise<Address> {
               return Promise.resolve(fake_addresses[0])
         }
         list(): Promise<Address[]> {
              return Promise.resolve(fake_addresses)
         }
         remove(id: string): Promise<void> {
              return Promise.resolve()
         }
         appendUserToAddress(params: IAddressesServices.Params.AppendUser): Promise<void> {
               return Promise.resolve(null)
         }

    }

     const addressesServices = new AddressesServicesStub()
     const create = new CreateAddressController(addressesServices)
     const update = new UpdateAddressController(addressesServices)
     const remove = new RemoveAddresController(addressesServices)
     const find = new FindAddresController(addressesServices)

     return { create, update, remove, find, addressesServices, fake_addresses }
}

const MakeCreateParams = (params?: Partial<IAddressesServices.Params.Create>): IAddressesServices.Params.Create =>{
     return ({
          city:"Cidade Teste",
          details:"Detalhe teste",
          number:"123",
          uf:"RJ",
          postalCode:"00000000",
          region: "Bairro tal",
          street: "Rua tal, do tal",
          ...params
     })
}

describe("CreateAddressController", () =>{
     test("Should return status 400 if service throw AddressUfInvalidError", async () =>{
          const { create, addressesServices } = makeSut()
          jest.spyOn(addressesServices,'create').mockImplementationOnce(async ()=>{
               throw new AddressUfInvalidError()
          })
          const req = MakeRequest({body:MakeCreateParams({uf:"invalido"})})
          const res = await create.handler(req)
          expect(res).toEqual(BadRequest(new AddressUfInvalidError()))
     })

     test("Should throw error if unknown error", async () =>{
          const { create, addressesServices } = makeSut()

          jest.spyOn(addressesServices,'create').mockImplementationOnce(async()=>{
               throw new Error("Error qualquer")
          })

          const req = MakeRequest({body:MakeCreateParams()})
          const res = create.handler(req)
          await expect(res).rejects.toThrow()
     })
     test("Should return status 200 ", async () =>{
          const { create } = makeSut()

          const body =  MakeCreateParams()
          const req = MakeRequest({body})
          const res = await create.handler(req)

          expect(res.status).toBe(200)
     })  
})

describe("UpdateAddrescontroller", () =>{

     const makeUpdateRequest = (b: object, id: string): Request =>{
          return  MakeRequest({ body: MakeCreateParams(b), params: { id } })
     }

     test("Should return status 400 if invalid uf", async () =>{
          const { update, addressesServices } = makeSut()

          jest.spyOn(addressesServices,'update').mockImplementationOnce(async ()=>{
               throw new AddressUfInvalidError()
          })
          const req = makeUpdateRequest({uf:"invalid"}, 'any_id')
          const res = await update.handler(req)
          expect(res).toEqual(BadRequest(new AddressUfInvalidError()))
     })

     test("Should return status 404 if unknown id", async () =>{
          const { update, addressesServices} = makeSut()

          jest.spyOn(addressesServices,'update').mockImplementationOnce(async()=>{
               throw new AddressNotFoundError()
          })

          const req = makeUpdateRequest({}, 'invalid_id');

          const res = await update.handler(req)
          expect(res).toEqual(NotFound(new AddressNotFoundError())) 
     })

     test("Should throw error if unknown error", async () =>{
          const { update, addressesServices } = makeSut()

          jest.spyOn(addressesServices,'update').mockImplementationOnce(async()=>{
               throw new Error("Error qualquer")
          })
          const req = makeUpdateRequest({}, 'any_id');
          const res = update.handler(req)
          await expect(res).rejects.toThrow()
     })

     test("Should return status 200 ", async () =>{
          const { update } = makeSut()

          const body =  MakeCreateParams()
          const req = makeUpdateRequest({}, 'any_id');
          const res = await update.handler(req)

          expect(res.status).toBe(200)

     })  


})

describe("RemoveAddresController", () =>{


     test("Should return status 404 if service throws AddressNotFoundError", async () =>{
          const { remove, addressesServices } = makeSut()
   
          jest.spyOn(addressesServices,'remove').mockImplementationOnce(async ()=>{
               throw new AddressNotFoundError()
          }) 
          const req = MakeRequest({params: {id: "any_id"}});
          const res = await remove.handler(req)
          expect(res).toEqual(NotFound(new AddressNotFoundError())) 
     }) 

     test("Should throw error if unknown error", async () =>{
          const { remove, addressesServices } = makeSut()
          jest.spyOn(addressesServices,'remove').mockImplementationOnce(async()=>{
               throw new Error("Error qualquer")
          })
          const req = MakeRequest({params: {id: "any_id"}});
          const res = remove.handler(req)
          await expect(res).rejects.toThrow()
     })

     test("Should return Nocontent", async () =>{
          const { remove } = makeSut()
          const req = MakeRequest({params: {id: "any_id"}});
          const res = await remove.handler(req)
          expect(res).toEqual(Ok())
     })

})


describe("FindAddresController", () =>{


     test("Should return 204 if no user were found", async () =>{
          const { find, addressesServices } = makeSut()
   
          jest.spyOn(addressesServices,'find').mockImplementationOnce(async ()=>{
               return null
          }) 
          const req = MakeRequest({params: {id: "any_id"}});
          const res = await find.handler(req)
          expect(res).toEqual(Ok(null)) 
     }) 


     test("Should return 200 if user were found", async () =>{
          const { find, fake_addresses } = makeSut()
          const req = MakeRequest({params: {id: "any_id"}});
          const res = await find.handler(req)
          expect(res).toEqual(Ok(fake_addresses[0])) 
     }) 


     test("Should return 200 list if no parameter were provided", async () =>{
          const { find, fake_addresses } = makeSut()

          const req = MakeRequest();
          const res = await find.handler(req)
          expect(res).toEqual(Ok(fake_addresses)) 
     }) 


})


