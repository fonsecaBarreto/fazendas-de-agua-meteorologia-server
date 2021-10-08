
import { User, UsersRole } from "../../../domain/Entities/User"
import { UserInUseError, UserNotFoundError, UserRoleIsInvalidError, UsersErrors } from "../../../domain/Errors/UsersErrors"
import { IHasher } from "../../../domain/Interfaces/IHasher"
import { IIdGenerator } from "../../../domain/Interfaces/IIdGenerator"
import { IUserRepository } from "../../../domain/Interfaces/repositories/IUserRepository"
import { UsersServices } from '../../../domain/Services/UsersServices'
import { MakeFakeUser } from "../../mocks/MakeUser"
const makeSut = () =>{
     class IdGeneratorStub implements IIdGenerator {
          gen(): string {
               return "generated_id"
          }
     }

     class HasherStub implements IHasher{
          hash(value: string): string {
               return "hashed_password"
          }
          compare(value: string, hash: string): boolean {
               return true
          }

     }

     class UsersRepositoryStub implements IUserRepository {
          async findByUsername(username: string): Promise<User> {
               return null
          }
          async add(model: User): Promise<void> {
               return null
          }
          list(): Promise<User[]> {
               throw new Error("Method not implemented.")
          }
          async find(id: string): Promise<User> {
               return MakeFakeUser()
          }
          remove(id: string): Promise<boolean> {
               throw new Error("Method not implemented.")
          }
          update(model: User): Promise<void> {
               throw new Error("Method not implemented.")
          }

     }

     const usersRepository = new UsersRepositoryStub
     const idGenerator = new IdGeneratorStub();
     const hasher =  new HasherStub()


     const sut = new UsersServices(usersRepository,idGenerator, hasher)
     return { sut, idGenerator, hasher, usersRepository}
  
}

const makeCreateUserParams = (fields?: Partial<UsersServices.CreateParams>): UsersServices.CreateParams =>{
     return {
          name:"Nome teste",
          password:"123456",
          role: 0,
          username: "NomeDeUsuarioTeste",
          ...fields
     }
}

describe("UsersServices", () =>{
     describe("Create User", () =>{

          const staticUser = makeCreateUserParams({
               name:"Super Shock",
               username: "statusTestUser",
               password:"22222",
               role: 1,
          })

          test("Should throw error if role is outside range", async () =>{
               const { sut } = makeSut()
               const resp = sut.create(makeCreateUserParams({role: 3}))
               await expect(resp).rejects.toThrow(new UserRoleIsInvalidError())
          })

          test("Should call id Generator onde", async () =>{
               const { sut, idGenerator } = makeSut()
               const spy = jest.spyOn(idGenerator, 'gen')
               await sut.create(makeCreateUserParams({}))
               expect(spy).toHaveBeenCalledTimes(1)
               expect(spy).toHaveReturnedWith("generated_id")
          })

          test("Should call hasher with correct values ", async () =>{
               const { sut, hasher } = makeSut()
               const spy = jest.spyOn(hasher, 'hash')
               await sut.create(makeCreateUserParams({password:"teste123"}))
               expect(spy).toHaveBeenCalledTimes(1)
               expect(spy).toHaveBeenCalledWith("teste123")
          })

          test("Should call isUserAvailable with correct values", async () =>{
               const { sut } = makeSut()
               const spy = jest.spyOn(sut, 'isUserAvailable');
               await  sut.create(staticUser)
               expect(spy).toHaveBeenCalledTimes(1)
               expect(spy).toHaveBeenCalledWith({
                    ...staticUser,
                    id: "generated_id",
                    password:"hashed_password"
               })
          })

          test("Should throw error if user with the same username", async () =>{
               const { sut,usersRepository, idGenerator } = makeSut()

               const usuario = makeCreateUserParams({ username:"sameUsername" })

               jest.spyOn(idGenerator, 'gen').mockImplementation( ()=> "same_id" );
               jest.spyOn(usersRepository, 'findByUsername').mockImplementationOnce(async ()=>{
                    return MakeFakeUser({id:"differente_id", username:"sameUsername"})
               });
               const resp = sut.create(usuario)
               await expect(resp).rejects.toThrow(new UserInUseError())

          })
          test("Should not throw error if user with the same username but not samer username were found", async () =>{
               const { sut,usersRepository, idGenerator } = makeSut()
               const usuario = makeCreateUserParams({ username:"sameUsername" })

               jest.spyOn(idGenerator, 'gen').mockImplementation( ()=> "same_id" );
               jest.spyOn(usersRepository, 'findByUsername').mockImplementationOnce(async ()=>{
                    return MakeFakeUser({id:"same_id", username:"sameUsername"})
               });

               const resp = await sut.create(usuario)

               expect(resp).toBeTruthy()
            
          })

          test("Should call repository with correct values", async () =>{
               const { sut, usersRepository } = makeSut()

               const addSpy = jest.spyOn(usersRepository, "add");

               const resp = await sut.create(staticUser)

               expect(addSpy).toHaveBeenCalledWith({
                    ...staticUser,
                    id: "generated_id",
                    password:"hashed_password"
               })

               expect(resp).toBeTruthy()
               expect(resp).toEqual({
                    ...staticUser,
                    id: "generated_id",
                    password:"hashed_password"
               })
            
          })

     })


     describe("Update User", () =>{
    
          test("Show throw error ir user wasnt found by id", async () =>{
               const { sut, usersRepository} = makeSut()

               jest.spyOn(usersRepository,'find').mockImplementationOnce(async ()=>{
                    return null
               })
               const resp = sut.update('any_id',makeCreateUserParams())
               await expect(resp).rejects.toThrow(new UserNotFoundError())
          })

        /*   test("Should call update reposiotry with correct values", async () =>{
               const { sut, usersRepository } = makeSut()

               const usuario = MakeFakeUser({
                    name: "MeuNome",
                    username: "UsernameTeste"
               })

               jest.spyOn(usersRepository,'find').mockImplementationOnce( async (id:string): Promise<User>=>{
                    return usuario
               })

               const resp = await sut.update('any_id',makeCreateUserParams({
                    name: "outroNome",
                    username: "outroUserName",
                    password: "123456"
               }))

               expect(resp).toEqual(
                    {...usuario}
               )
               
          }) */



     })
}) 