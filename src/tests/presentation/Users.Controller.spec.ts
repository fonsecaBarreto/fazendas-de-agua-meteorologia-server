import { CreateUserController, FindUserController, RemoveUserController, UpdateUserController } from '../../presentation/Controllers/V1/Users.Controllers'
import { IUsersServices } from '../../domain/Services/Users/Users_Services'
import { Forbidden, Ok, NotFound } from '../../presentation/Protocols/Http'
import { UserNameInUseError, UserNotFoundError, UserRoleIsInvalidError } from '../../domain/Errors/UsersErrors'
import { MakeFakeUser } from '../mocks/entities/MakeUser'
import { MakeRequest } from './mocks/MakeRequest'
import { User, UsersRole } from '../../domain/Entities/User'
import { AddressesServices, IAddressesServices } from '../../domain/Services/Addresses/Addresses_Services'
import { UserView } from '../../domain/Views/UserView'
import { AddressNotFoundError } from '../../domain/Errors/AddressesErrors'

const makeSut = () =>{

     class UsersServicesStub implements IUsersServices {
          create(params: IUsersServices.Params.Create): Promise<UserView> {
               return Promise.resolve(new UserView(MakeFakeUser({id:"generated_id", name: "Nome Teste"})))
          }
          update(id: string, params: IUsersServices.Params.Update): Promise<UserView> {
               return Promise.resolve(new UserView(MakeFakeUser({id, ...params})))
          }
          find(id: string): Promise<UserView> {
               throw new Error('Method not implemented.')
          }
          list(): Promise<User[]> {
               throw new Error('Method not implemented.')
          }
          remove(id: string): Promise<void> {
              return Promise.resolve(null)
          }
     }

     class AddressServicesStub  implements Pick<AddressesServices,'appendUserToAddress'>{
          public appendUserToAddress(params: IAddressesServices.Params.AppendUser): Promise<void> {
               return Promise.resolve(null)
          }
     }

     const usersServices = new UsersServicesStub()
     const addressServices = new AddressServicesStub()

     const create = new CreateUserController(usersServices, addressServices)
     const find = new FindUserController(usersServices)
     const remove = new RemoveUserController(usersServices)
     const update = new UpdateUserController(usersServices)

     return { create, update, find, remove, usersServices, addressServices }
}

describe("CreateUserController", () =>{

     const makeCreateUserParams = () => {
          return ({
               name: "Mario",
               username: "usuario",
               role: 0,
               password: "123456",
          })
     }
     test("Should return status 403 if invalid role", async () =>{
          const { create, usersServices } = makeSut()

          jest.spyOn(usersServices, 'create').mockImplementationOnce(async ()=>{
               throw new UserRoleIsInvalidError()
          })
          
          const req = MakeRequest({ body: { ...makeCreateUserParams(),role:3 } })
          const res = await create.handler(req)
          expect(res).toEqual(Forbidden(new UserRoleIsInvalidError()))
     })
     test("Should return status 403 if UserName in use", async () =>{
          const { create, usersServices } = makeSut()

          jest.spyOn(usersServices, 'create').mockImplementationOnce(async ()=>{
               throw new UserNameInUseError()
          })
          
          const req = MakeRequest({ body: { ...makeCreateUserParams(),username:"inuse_username" } })
          const res = await create.handler(req)
          expect(res).toEqual(Forbidden(new UserNameInUseError()))
     })

     test("Should throw error if unknown error", async () =>{
          const { create, usersServices } = makeSut()

          jest.spyOn(usersServices,'create').mockImplementationOnce(async()=>{
               throw new Error("Error qualquer")
          })
          const req = MakeRequest({body:makeCreateUserParams()})
          const res = create.handler(req)
          await expect(res).rejects.toThrow()
     })


     test("Should call users Services with correct values", async () =>{
          const { create, usersServices } = makeSut()

          const spy = jest.spyOn(usersServices,'create')
          const params = makeCreateUserParams()
          const req = MakeRequest({body:params})
          await create.handler(req)
          expect(spy).toHaveBeenCalledWith(params)
     })

     test("Should call 'addressServices' if a address_id were provided", async () =>{
          const { create, addressServices, usersServices } = makeSut()

          jest.spyOn(usersServices,'create').mockImplementationOnce(async ()=>{
               return new UserView(MakeFakeUser({ role: UsersRole.Basic, id:"generated_id" }))
          })

          const spy = jest.spyOn(addressServices, 'appendUserToAddress');

          const req = MakeRequest({body:{ ...makeCreateUserParams(), role: UsersRole.Basic, address_id: "any_id"}})
          await create.handler(req);
          expect(spy).toHaveBeenCalledTimes(1)
          expect(spy).toHaveBeenCalledWith({user_id:'generated_id', address_id: 'any_id'})
     })

     test("Should return status 200 ", async () =>{
          const { create } = makeSut()

          const body =  makeCreateUserParams()
          const req = MakeRequest({body})
          const res = await create.handler(req)

          expect(res.status).toBe(200)
          expect(res.body).toMatchObject({
               id: 'generated_id',
               name: "Nome Teste",
               username: "username teste",
               role: 0,
          })

     })   
})


 
describe("UpdateUserController", () =>{

     const makeUpdateUserParams = () => {
          return ({
               name: "Mario",
               username: "usuario"
          })
     }
     test("Should return status 404 if service throw  UsetNotFound", async () =>{
          const { update, usersServices } = makeSut()
          jest.spyOn(usersServices,'update').mockImplementationOnce( async ()=>{
               throw new UserNotFoundError()
          })
          const req = MakeRequest({body:{...makeUpdateUserParams(),role:0}})
          const res = await update.handler(req)
          expect(res).toEqual(NotFound(new UserNotFoundError()))
     })

     test("Should return status 403 if UserName is in use by another user", async () =>{
          const { update, usersServices } = makeSut()

          jest.spyOn(usersServices, 'update').mockImplementationOnce(async ()=>{
               throw new UserNameInUseError()
          })
          
          const req = MakeRequest({ body: { ...makeUpdateUserParams(),username:"inuse_username" } })
          const res = await update.handler(req)
          expect(res).toEqual(Forbidden(new UserNameInUseError()))
     })

     test("Should throw error if unknown error", async () =>{
          const { update, usersServices } = makeSut()

          jest.spyOn(usersServices,'update').mockImplementationOnce(async()=>{
               throw new Error("Error qualquer")
          })
          const req = MakeRequest({body:makeUpdateUserParams()})
          const res = update.handler(req)
          await expect(res).rejects.toThrow()
     })

     test("Should return status 200 ", async () =>{
          const { update } = makeSut()

          const req = MakeRequest({ body: { name: "Novo Nome", username: "Joaquim"}, params: { id: "user_test_id" } });
          const res = await update.handler(req)
          expect(res.status).toBe(200)
          expect(res.body).toMatchObject({
               id: 'user_test_id',
               name: "Novo Nome",
               username: "Joaquim"
          }) 
     })  
})

describe("FindUserController", () =>{

     test("Should return status 204 if no user were found", async () =>{
          const { find, usersServices } = makeSut()
          jest.spyOn(usersServices,'find').mockImplementationOnce( async ()=>{
               return null
          })
          const req = MakeRequest({ params: { id: 'invalid_id' } })
          const res = await find.handler(req)
          expect(res).toEqual(Ok(null))
     })

     test("Should return 200", async () =>{
          const { find, usersServices  } = makeSut()
          const user = new UserView(MakeFakeUser())

          jest.spyOn(usersServices,'find').mockImplementationOnce( async ()=>{
               return user
          })

          const req = MakeRequest({ params: { id: 'any_id' } })
          const res = await find.handler(req)
          expect(res.status).toBe(200)
          expect(res.body).toMatchObject(user)
     })


     test("Should return a list with 200 statyus ", async () =>{
          const { find, usersServices } = makeSut()
          const users= [ MakeFakeUser() ]
          jest.spyOn(usersServices,'list').mockImplementationOnce( async ()=>{
               return users
          })

          const req = MakeRequest();
          const res = await find.handler(req);

          expect(res).toMatchObject(Ok(users))

     }) 

})



describe("RemoveUserController", () =>{

     test("Should return status 404 if service throws AddressNotFoundError", async () =>{
          const { remove, usersServices } = makeSut()
   
          jest.spyOn(usersServices,'remove').mockImplementationOnce(async ()=>{
               throw new UserNotFoundError()
          }) 
          const req = MakeRequest({params: {id: "any_id"}});
          const res = await remove.handler(req)
          expect(res).toEqual(NotFound(new UserNotFoundError())) 
     }) 

    test("Should throw error if unknown error", async () =>{
          const { remove, usersServices } = makeSut()
          jest.spyOn(usersServices,'remove').mockImplementationOnce(async()=>{
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
