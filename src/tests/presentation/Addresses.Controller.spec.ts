import { CreateAddressController, FindAddresController, ListAddressController, RemoveAddresController, UpdateAddressController } from '../../presentation/Controllers/V1/General/Addresses.Controller'
import { IAddressesServices } from '../../domain/Services/Addresses/Addresses_Services'
import { Address } from '../../domain/Entities/Address'
import { Request } from '../../presentation/Protocols/Http'
import { BadRequest, Forbidden, NotFound, Ok, Unauthorized } from '../../presentation/Protocols/http-helper'
import { AddressNotFoundError, AddressUfInvalidError } from '../../domain/Errors/AddressesErrors'
import { MakeFakeAddress } from '../mocks/entities/MakeAddress'
import { MakeRequest } from './mocks/MakeRequest'
import { AddressView } from '../../domain/Views/AddressView'
import { IAddressRepository } from '../../domain/Interfaces'
import { StationNotFoundError } from '../../domain/Errors/StationsErrors'
import { MakeFakeUser } from '../mocks/entities/MakeUser'
import { UserView } from '../../domain/Views/UserView'
import { UsersRole } from '../../domain/Entities/User'

const makeSut = () =>{

     const fake_addresses = [  MakeFakeAddress()  ]

     class AddressesServicesStub implements IAddressesServices{

         async create(params: IAddressesServices.Params.Create): Promise<AddressView> {
              return new AddressView(MakeFakeAddress())
         }
         async update(id: string, address: IAddressesServices.Params.Create): Promise<AddressView> {
               return new AddressView(MakeFakeAddress())
         }
         find(id: string): Promise<AddressView> {
               return Promise.resolve(new AddressView(fake_addresses[0]))
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

     class AddressRepositoryStub implements Pick<IAddressRepository, 'isUserRelated'>{
          isUserRelated(user_id: string, address_id: string): Promise<boolean> {
               return Promise.resolve(true)
          }
          
     }

     const addressesRepository = new AddressRepositoryStub()
     const addressesServices = new AddressesServicesStub()
     const create = new CreateAddressController(addressesServices)
     const update = new UpdateAddressController(addressesServices)
     const remove = new RemoveAddresController(addressesServices)
     const find = new FindAddresController(addressesServices, addressesRepository)
     const list = new ListAddressController(addressesServices)

     return { create, update, remove, find, list, addressesServices, fake_addresses, addressesRepository }
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

describe("ListAddressController",() =>{


     describe("default view", () =>{

          test("Should return 204 if no address were found", async () =>{
               const { list, addressesServices } = makeSut()
               jest.spyOn(addressesServices,'list').mockImplementationOnce(async ()=>[]) 
               const req = MakeRequest({});
               const res = await list.handler(req)
               expect(res).toEqual(Ok([])) 
          }) 
          
          test("Should return 200 list if no parameter were provided", async () =>{
               const { list, fake_addresses } = makeSut()
               const req = MakeRequest();
               const res = await list.handler(req)
               expect(res).toEqual(Ok(fake_addresses)) 
          }) 

     })

     describe("Label View", () =>{

          test("Should return a 204 list if no address were found", async () =>{
               const { list, addressesServices } = makeSut()
               jest.spyOn(addressesServices,'list').mockImplementationOnce(async ()=> [] ) 
               const req = MakeRequest({ query:{v:"labelview" }});
               const res = await list.handler(req)
               expect(res).toEqual(Ok([])) 
          }) 
          
          test("Should return LabelView list", async () =>{
               const { list,  addressesServices } = makeSut()
               jest.spyOn(addressesServices,'list').mockImplementationOnce(async ()=> [
                    MakeFakeAddress({
                         id:"id_test_1",
                         street: "Ciadade Teste 1",  number: "123",  region: "Bairro Teste", details: "Casa 2",
                    city: "Cidade Teste", uf:"RJ", postalCode: "00000000",
               }),
               MakeFakeAddress({
                    id:"id_test_2",
                    street: "Ciadade Teste 2",  number: "123",  region: "Bairro Teste", details: "Casa 1",
                    city: "Cidade Teste", uf:"RJ", postalCode: "00000000",
               })
               ]) 
               
               const req = MakeRequest({ query:{v:"labelview" }});
               const res = await list.handler(req)
               
               expect(res).toEqual(Ok([
                    { 
                         value: 'id_test_1',
                         label: `Ciadade Teste 1, 123; Bairro Teste, Cidade Teste - RJ (00000000)`
                    },
                    { 
                         value: 'id_test_2',
                         label: `Ciadade Teste 2, 123; Bairro Teste, Cidade Teste - RJ (00000000)`
                    }
               ]))  
          }) 

     }) 
})

describe("FindAddresController", () =>{
     const makeFindRequest = (fields?: Partial<Request>): Request =>{
          return MakeRequest({
               params : { id: 'any_id'},
               user: new UserView(MakeFakeUser({role: UsersRole.Admin})),
               ...fields
          })
     }

     describe("NonAdmin", () =>{

          test("Should return 401 if a non-Admin user were provided with no address", async () =>{
               const { find, addressesRepository} = makeSut()
               const repoSpy = jest.spyOn(addressesRepository,'isUserRelated');
               const req = makeFindRequest({user: new UserView(MakeFakeUser({role: UsersRole.Basic}))})
               const res = await find.handler(req)
               expect(res).toEqual(Unauthorized())
               expect(repoSpy).toHaveBeenCalledTimes(0)
          }) 

          test("Should call  addressrepo with correct values", async () =>{
               const { find, addressesRepository } = makeSut()
               const repoSpy = jest.spyOn(addressesRepository,'isUserRelated').mockImplementationOnce(async()=>false);
               const req = makeFindRequest({params:{id:"any_address_id"},user: new UserView(MakeFakeUser({role: UsersRole.Basic}), MakeFakeAddress())})
               const res = await find.handler(req)
               expect(repoSpy).toHaveBeenCalledWith(req.user.id, 'any_address_id')
               expect(res).toEqual(Unauthorized())
          }) 

          test("Should return if addressrepo return true", async () =>{
               const { find, fake_addresses } = makeSut()
               const req = makeFindRequest({params:{id:"any_address_id"},user: new UserView(MakeFakeUser({role: UsersRole.Basic}), MakeFakeAddress())})
               const res = await find.handler(req)
               expect(res).toEqual(Ok(new AddressView(fake_addresses[0]))) 
          })   
          
     })
     describe("Default", () =>{

          test("Should return 204 if no address were found", async () =>{
               const { find, addressesServices } = makeSut()
               
               jest.spyOn(addressesServices,'find').mockImplementationOnce(async ()=>{
                    return null
               }) 

               const req = makeFindRequest()
               const res = await find.handler(req)
               expect(res).toEqual(Ok(null)) 
          }) 
          
          
          test("Should return 200 if address were found", async () =>{
               const { find, fake_addresses } = makeSut()
               const req = makeFindRequest()
               const res = await find.handler(req)
               expect(res).toEqual(Ok(new AddressView(fake_addresses[0]))) 
          }) 
          
     })

     describe("With Query v='labelview' ", () =>{

          test("Should return 204 if no address were found", async () =>{
               const { find, addressesServices } = makeSut()
               jest.spyOn(addressesServices,'find').mockImplementationOnce(async ()=> null) 
               const req  = makeFindRequest({query:{v:"labelview"}});
               const res = await find.handler(req)
               expect(res).toEqual(Ok(null)) 
          }) 
          
          test("Should return 200 if a address were found", async () =>{
               const { find, fake_addresses } = makeSut()
               const req  = makeFindRequest({query:{v:"labelview"}});
               const res = await find.handler(req)
               expect(res).toEqual(Ok(new AddressView(fake_addresses[0]).getLabelView())) 
          })         
     })
})
     