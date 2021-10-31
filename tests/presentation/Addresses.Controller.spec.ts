import { CreateAddressController, FindAddresController, ListAddressController, RemoveAddresController, UpdateAddressController } from '../../src/presentation/Controllers/V1/General/Addresses.Controller'
import { IAddressesServices } from '../../src/domain/Services/Addresses/Addresses_Services'
import { Address } from '../../src/domain/Entities/Address'
import { Request } from '../../src/presentation/Protocols/Http'
import { BadRequest, Forbidden, NotFound, Ok, Unauthorized } from '../../src/presentation/Protocols/http-helper'
import { AddressNotFoundError, AddressUfInvalidError } from '../../src/domain/Errors/AddressesErrors'
import { MakeFakeAddress } from '../mocks/entities/MakeAddress'
import { MakeRequest } from './mocks/MakeRequest'
import { AddressView } from '../../src/domain/Views/AddressView'
import { IAddressRepository } from '../../src/domain/Interfaces'
import { MakeFakeUser } from '../mocks/entities/MakeUser'
import { UserView } from '../../src/domain/Views/UserView'
import { UsersRole } from '../../src/domain/Entities/User'

import { MakeAddressBodyDto } from '../mocks/dtos/MakeAddressDtos'
import { IPermissionsServices, PermissionsServices } from '@/domain/Services/Users/Permision_Services'
import { UserNotAllowedError } from '@/domain/Errors'

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

     class PermissionServiceStub implements  Pick<IPermissionsServices, 'isUserRelatedToAddress'>{
          isUserRelatedToAddress(params: PermissionsServices.Params.isUserRelatedToAddress): Promise<boolean> {
               return Promise.resolve(true);
          }
     }


     const permissionServices = new PermissionServiceStub
     const addressesServices = new AddressesServicesStub()
     const create = new CreateAddressController(addressesServices)
     const update = new UpdateAddressController(addressesServices)
     const remove = new RemoveAddresController(addressesServices)
     const find = new FindAddresController(permissionServices, addressesServices)
     const list = new ListAddressController(addressesServices)

     return { create, update, remove, find, list, addressesServices, fake_addresses, permissionServices }
}


describe("CreateAddressController", () =>{
     test("Should return status 400 if service throw AddressUfInvalidError", async () =>{
          const { create, addressesServices } = makeSut()
          jest.spyOn(addressesServices,'create').mockImplementationOnce(async ()=>{
               throw new AddressUfInvalidError()
          })
          const req = MakeRequest({body:MakeAddressBodyDto({uf:"invalido"})})
          const res = await create.handler(req)
          expect(res).toEqual(BadRequest(new AddressUfInvalidError()))
     })

     test("Should throw error if unknown error", async () =>{
          const { create, addressesServices } = makeSut()

          jest.spyOn(addressesServices,'create').mockImplementationOnce(async()=>{
               throw new Error("Error qualquer")
          })

          const req = MakeRequest({body:MakeAddressBodyDto()})
          const res = create.handler(req)
          await expect(res).rejects.toThrow()
     })
     test("Should return status 200 ", async () =>{
          const { create } = makeSut()

          const body =  MakeAddressBodyDto()
          const req = MakeRequest({body})
          const res = await create.handler(req)

          expect(res.status).toBe(200)
     })  
})
describe("UpdateAddrescontroller", () =>{

     const makeUpdateRequest = (b: object, id: string): Request =>{
          return  MakeRequest({ body: MakeAddressBodyDto(b), params: { id } })
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

          const body =  MakeAddressBodyDto()
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
     describe("Default View", () =>{

          test("Should call permision service with correct values", async () =>{
               const { find, permissionServices } = makeSut()
               const permisionSpy = jest.spyOn(permissionServices,'isUserRelatedToAddress');
               const usuario =  new UserView(MakeFakeUser({role: UsersRole.Basic}));
               const req = makeFindRequest({user: usuario, params: { id: "not_related_address_id"}});
               await find.handler(req)
               expect(permisionSpy).toBeCalledWith({ user: usuario, address_id: 'not_related_address_id'})
          }) 

          test("Should return 403 permision service returns false", async () =>{
               const { find, permissionServices } = makeSut()
               jest.spyOn(permissionServices,'isUserRelatedToAddress').mockImplementationOnce(()=>Promise.resolve(false));
               const req = makeFindRequest({user: new UserView(MakeFakeUser({role: UsersRole.Basic}))})
               const res = await find.handler(req)
               expect(res).toEqual(Forbidden(new UserNotAllowedError()))
          })  

          test("Should call services with correct values", async () =>{
               const { find, addressesServices } = makeSut();
               const findSpy = jest.spyOn(addressesServices,'find');
               const req = makeFindRequest({params:{id:"any_address_id"}});
               const res = await find.handler(req);
               expect(findSpy).toHaveBeenCalledWith('any_address_id')
          })   

          test("Should return 204 if no address were found", async () =>{
               const { find, addressesServices } = makeSut()
               jest.spyOn(addressesServices,'find').mockImplementationOnce(()=> Promise.resolve(null)) 
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
  
          test("Should return 200 if a address were found", async () =>{
               const { find, fake_addresses } = makeSut()
               const req  = makeFindRequest({query:{v:"labelview"}});
               const res = await find.handler(req)
               expect(res).toEqual(Ok(new AddressView(fake_addresses[0]).getLabelView())) 
          }) 
    
     })

})
     