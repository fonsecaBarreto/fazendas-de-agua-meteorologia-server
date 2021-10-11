import { User, UsersRole } from '../../domain/Entities/User';
import { AppSchemaTools, SchemaBuilder } from '../../libs/ApplicatonSchema/SchemaBuilder';
import { SchemaValidator } from '../../libs/ApplicatonSchema/SchemaValidator';
import { AccessType, BaseController } from '../../presentation/Protocols/BaseController'
import { Request, Response } from '../../presentation/Protocols/Http'
import { Ok, Unauthorized } from '../../presentation/Protocols/http-helper'
import { MakeFakeUser } from '../mocks/entities/MakeUser';
import { MakeRequest } from './mocks/MakeRequest';


describe("Base Controller", () => {

     describe("securityGuard", () =>{

          const makeSut = (access: AccessType) =>{
               class controllerStub extends BaseController {
                    constructor(){super(access)}
                    async handler(request: Request): Promise<Response> {
                         return Ok();
                    }
               }
               const sut =  new controllerStub()
               return sut 
          }

          const anyUserController = makeSut(AccessType.ANY_USER)
          const publicControler = makeSut(AccessType.PUBLIC)
          const basicController = makeSut(AccessType.BASIC)
          const adminController = makeSut(AccessType.ADMIN)

          test("Shoudl call it with the correct values", async ( ) => {
               const securityGuard = jest.spyOn(publicControler, 'securityGuard');
               const usuario = MakeFakeUser();
               const req = MakeRequest({ user: usuario })
               await publicControler._handler(req);
               expect(securityGuard).toHaveBeenCalledWith(usuario)
          })
                  
          test("Should returns true if public access", async ( ) => {
               const req = MakeRequest({})
               const securityGuard = jest.spyOn(publicControler, 'securityGuard');
               const res = await publicControler._handler(req);
               expect(securityGuard).toHaveBeenCalledWith(undefined)
               expect(securityGuard).toHaveReturnedWith(true)
               expect(res).toEqual(Ok())
          })

          test("Should return 401 if not a basic User", async ( ) => {
               const req = MakeRequest({user: MakeFakeUser({role: UsersRole.Admin})})
               var res = await basicController._handler(req);
               expect(res).toEqual(Unauthorized())
          })

          test("Should return 401 if not a Admin User", async ( ) => {
               const req = MakeRequest({user: MakeFakeUser({role: UsersRole.Basic})})
               var res = await adminController._handler(req);
               expect(res).toEqual(Unauthorized())
          })

          test("Shoudl return 401 if not a user", async ( ) => {
               const req = MakeRequest({})
               var res = await anyUserController._handler(req);
               expect(res).toEqual(Unauthorized())
          })
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