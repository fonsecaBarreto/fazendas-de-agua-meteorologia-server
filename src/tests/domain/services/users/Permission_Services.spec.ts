
import { User, UsersRole } from "../../../../domain/Entities/User"
import { IAddressRepository, IStationRepository } from "../../../../domain/Interfaces"
import { PermissionsServices } from "../../../../domain/Services/Users/Permision_Services"

import { MakeFakeUser } from "../../../mocks/entities/MakeUser"
import { HasherStub } from '../../../mocks/vendors/HasherStub'
import { EncrypterStub } from '../../../mocks/vendors/EncrypterStub'
import { UserView } from "../../../../domain/Views/UserView"
import { Station } from "../../../../domain/Entities/Station"
import { MakeFakeStation } from "../../../mocks/entities/MakeStation"
import { textSpanEnd } from "typescript"
import { StationNotFoundError } from "../../../../domain/Errors/StationsErrors"

const makeSut = () =>{

     const fakeStations = [ MakeFakeStation() ]
     class UsersRepositoryStub implements Pick<IAddressRepository, 'isUserRelated'>{
          isUserRelated(user_id: string, address_id: string): Promise<boolean> {
               return Promise.resolve(true)
          }
     }

     class StationsRepositoryStub implements Pick<IStationRepository, 'find'>{
          find(id: string): Promise<Station> {
               return Promise.resolve(fakeStations[0])
          }
     }

     const addressRepository = new UsersRepositoryStub
     const stationRepository = new StationsRepositoryStub

     const sut = new PermissionsServices(addressRepository,stationRepository)
     return { sut, addressRepository, stationRepository, fakeStations }
  
}

describe("PermissionsServices", () =>{
     describe("isUserRelatedToAddress", () =>{
          const MakeFakeParams = ( fields?: Partial<PermissionsServices.Params.isUserRelatedToAddress>) => {
               return ({
                    user: MakeFakeUser(),
                    address_id: 'any_address_ud',
                    ...fields
               })
          }
          test("Should return false if no user where provided", async () =>{
               const { sut} = makeSut()
               const result = await sut.isUserRelatedToAddress(MakeFakeParams({user: null}))
               expect(result).toBe(false)
          })

          test("Should return true if user role is 'admin", async () =>{
               const { sut} = makeSut()
               const result = await sut.isUserRelatedToAddress(MakeFakeParams({user: MakeFakeUser({role: UsersRole.Admin})}))
               expect(result).toBe(true)
          })

          test("Shoud false if addressRepo return null",  async () =>{
               const { sut, addressRepository } = makeSut()
               const addressRepoSpy = jest.spyOn(addressRepository, 'isUserRelated').mockImplementationOnce(()=>{
                    return Promise.resolve(null)
               })
               const usuario = MakeFakeUser({role: UsersRole.Basic})
               const result = await sut.isUserRelatedToAddress(MakeFakeParams({user: usuario, address_id:"address_id_test" }))

               expect(addressRepoSpy).toBeCalledWith(usuario.id, "address_id_test")
               expect(result).toBe(false)
          })
          test("Shoud return true",  async () =>{
               const { sut,  } = makeSut()
      
               const usuario = MakeFakeUser({role: UsersRole.Basic})
               const result = await sut.isUserRelatedToAddress(MakeFakeParams({user: usuario, address_id:"address_id_test" }))
               expect(result).toBe(true)
          }) 

     })

     describe("isUserAllowedToStation", () =>{
          const MakeFakeParams = ( fields?: Partial<PermissionsServices.Params.isUserAllowedToStation>) => {
               return ({
                    user: MakeFakeUser(),
                    station_id: 'any_station_id',
                    ...fields
               })
          }
          test("Should throw error if stationRepo throws", async () =>{
               const { sut, stationRepository} = makeSut()
               const repoSpy = jest.spyOn(stationRepository, 'find').mockImplementationOnce(()=>{
                    return Promise.resolve(null)
               })
               const result = sut.isUserAllowedToStation(MakeFakeParams())
               await expect(result).rejects.toThrow(new StationNotFoundError())
               expect(repoSpy).toHaveBeenCalledWith('any_station_id')
          })

          test("Shoud false ",  async () =>{
               const { sut, fakeStations } = makeSut()
               const serviceSpy = jest.spyOn(sut, 'isUserRelatedToAddress').mockImplementationOnce(()=>{
                    return Promise.resolve(false)
               })
               const usuario =  MakeFakeUser({id:"id_test_usuario"})
               const result =await sut.isUserAllowedToStation(MakeFakeParams({user: usuario}))
               expect(result).toBe(false)
               expect(serviceSpy).toBeCalledWith({ user: usuario, address_id: fakeStations[0].address_id})
          })
          test("Shoud return true",  async () =>{
               const { sut  } = makeSut()
               const result = await sut.isUserAllowedToStation(MakeFakeParams())
               expect(result).toBe(true)
          })  

          test("should throw error if it was throwed",  async () =>{
               const { sut } = makeSut()
              jest.spyOn(sut, 'isUserRelatedToAddress').mockImplementationOnce(()=>{
                    return Promise.reject(new Error("Um Erro Qualquer"))
               })
               const result = sut.isUserAllowedToStation(MakeFakeParams())
               await expect(result).rejects.toThrow(new Error("Um Erro Qualquer"))
     
          })  
     })

}) 