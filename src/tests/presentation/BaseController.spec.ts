import { User, UsersRole } from '../../domain/Entities/User';
import { UserView } from '../../domain/Views/UserView';
import { AccessType, BaseController } from '../../presentation/Protocols/BaseController'
import { Request, Response } from '../../presentation/Protocols/Http'
import { Ok, Unauthorized } from '../../presentation/Protocols/http-helper'
import { MakeFakeAddress } from '../mocks/entities/MakeAddress';
import { MakeFakeUser } from '../mocks/entities/MakeUser';
import { MakeRequest } from './mocks/MakeRequest';

const makeSut = (access: AccessType) =>{
     class controllerStub extends BaseController {
          constructor(){super(access)}
          async handler(request: Request): Promise<Response> {
               return Ok(request.user);
          }
     }
     const sut =  new controllerStub()
     return sut 
}

describe("Base Controller", () => {

     describe("securityGuard", () =>{
          
          test("Shoudl call it with the correct values", async ( ) => {

               const sut = makeSut(AccessType.ANY_USER)
               const securityGuard = jest.spyOn(sut, 'securityGuard');
               const usuario = new UserView(MakeFakeUser());
               const req = MakeRequest({ user: usuario })
               await sut._handler(req);
               expect(securityGuard).toHaveBeenCalledWith(usuario)
          })
                  
          test("Should returns true if public access", async ( ) => {
               const sut = makeSut(AccessType.PUBLIC)
               const req = MakeRequest({})
               const securityGuard = jest.spyOn(sut, 'securityGuard');
               const res = await sut._handler(req);
               expect(securityGuard).toHaveBeenCalledWith(req.user)
               expect(securityGuard).toHaveReturnedWith(true)
               expect(res).toEqual(Ok(null))
          })

          test("Shoudl return 401 if not a user", async ( ) => {
               const sut = makeSut(AccessType.ANY_USER)
               const req = MakeRequest({})
               var res = await sut._handler(req);
               expect(res).toEqual(Unauthorized())
          })

          describe("Admin Access", () =>{

               const sut = makeSut(AccessType.ADMIN)
               test("Should return 401 if any user were provided", async ( ) => {
                    const req = MakeRequest( )
                    var res = await sut._handler(req);
                    expect(res).toEqual(Unauthorized())
               })

               test("Should return 401 if basic user were provided", async ( ) => {
                    const req = MakeRequest( { user: new UserView(MakeFakeUser({role: UsersRole.Basic}))} )
                    var res = await sut._handler(req);
                    expect(res).toEqual(Unauthorized())
               })
         
               test("Should return 200 if Admin user", async ( ) => {
                    const usuario = new UserView(MakeFakeUser({role: UsersRole.Admin}), MakeFakeAddress())
                    const req = MakeRequest({ user: usuario })
                    var res = await sut._handler(req);
                    expect(res).toEqual(Ok(usuario))
               })
               
          })



          describe("Basic Access", () =>{

               const sut = makeSut(AccessType.BASIC)
               test("Should return 401 if any user were provided", async ( ) => {
                    const req = MakeRequest( )
                    var res = await sut._handler(req);
                    expect(res).toEqual(Unauthorized())
               })

               test("Should return 401 if Admin user were provided", async ( ) => {
                    const req = MakeRequest( { user: new UserView(MakeFakeUser({role: UsersRole.Admin}))} )
                    var res = await sut._handler(req);
                    expect(res).toEqual(Unauthorized())
               })
         
               test("Should return 200 if Basic user", async ( ) => {
                    const usuario = new UserView(MakeFakeUser({role: UsersRole.Basic}), MakeFakeAddress())
                    const req = MakeRequest({ user: usuario })
                    var res = await sut._handler(req);
                    expect(res).toEqual(Ok(usuario))
               })
               
          })

         /*  describe("Station Access", () =>{

               const sut = makeSut(AccessType.STATION)
               test("Should return 401 if any user were provided", async ( ) => {
                    const req = MakeRequest( )
                    var res = await sut._handler(req);
                    expect(res).toEqual(Unauthorized())
               })
               test("Should return 401 if Basic user were provided", async ( ) => {
                    const req = MakeRequest( { user: new UserView(MakeFakeUser({role: UsersRole.Basic}))} )
                    var res = await sut._handler(req);
                    expect(res).toEqual(Unauthorized())
               })
               test("Should return 401 if Admin user were provided", async ( ) => {
                    const req = MakeRequest( { user: new UserView(MakeFakeUser({role: UsersRole.Admin}))} )
                    var res = await sut._handler(req);
                    expect(res).toEqual(Unauthorized())
               })
               test("Should return 200 if Admin user if a address attached", async ( ) => {

                    const usuario = new UserView(MakeFakeUser({role: UsersRole.Admin}), MakeFakeAddress())
                    const req = MakeRequest({ user: usuario })
                    var res = await sut._handler(req);
                    expect(res).toEqual(Ok(usuario))
               })
               
          }) */
     })


   /*   describe("ValidationGuard", ( )=>{

          const makeSut = (schemas?: BaseController.RequestsSchema) =>{

               const validator = new SchemaValidator;
               BaseController._validator = validator;

               class controllerStub extends BaseController {
                    constructor(){super(AccessType.PUBLIC, schemas)}
                    async handler(request: Request): Promise<Response> {
                         return Ok();
                    }
               }

               const sut =  new controllerStub()
               return { sut, validator } 
          }

          const bodySchema = SchemaBuilder.create(s =>{
               s.string("name").description("nome")
               s.number("age").description("idade")
          })

          const paramsSchema = SchemaBuilder.create(s =>{
               s.string("id").description("Identificação")
          })

     }) */
})