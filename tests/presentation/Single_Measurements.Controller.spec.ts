import { CreateMeasurementsController } from '../../src/presentation/Controllers/V1/Measurement/Single_Measurement_Upload.Controller'
import {AppSchema, SchemaValidator } from '../../src/libs/ApplicatonSchema/SchemaValidator'
import { CsvReader, Errors as CsvReaderErros, Errors } from '../../src/libs/CsvReader'
import { MakeFakeMeasurement } from '../mocks/entities/MakeMeasurement'
import { IMeasurementsService } from '../../src/domain/Services/Stations/Measurements_Services'
import { MeasurementView } from '../../src/domain/Views/MeasurementView'
import { MakeRequest } from './mocks/MakeRequest'
import { BadRequest, Forbidden, NotFound, Ok, Unauthorized, Unprocessable } from '../../src/presentation/Protocols/http-helper'
import { IStationRepository } from '../../src/domain/Interfaces'
import { Station } from '../../src/domain/Entities/Station'
import { MakeFakeStation } from '../mocks/entities/MakeStation'
import { MakeFakeUser } from '../mocks/entities/MakeUser'
import { UsersRole } from '../../src/domain/Entities/User'
import { UserView } from '../../src/domain/Views/UserView'
import { MakeFakeAddress } from '../mocks/entities/MakeAddress'

import { Measurement_CreateBodySchema } from '../../src/presentation/Models/Schemas/MeaserumentsSchemas'
import { StationNotFoundError } from '../../src/domain/Errors/StationsErrors'
import { InvalidWindDirectionError, MeasurementsDuplicatedError } from '../../src/domain/Errors/MeasurementsErrors'
import { CardialPointsList } from '../../src/presentation/Controllers/V1/Measurement/Helpers/MultiplesMeasurementsValidator'

const makeSut  =  () =>{

     const fake_csvEntries = [{ 
          date: "01/01/2020",  hour: "00:00:00", temperature: "32", airHumidity: "1", 
          windSpeed: "10", windDirection: "NW",  rainVolume: "2", accRainVolume:"20" 
     }]
       
     class CsvReaderStub implements CsvReader {
          read(file: Buffer): Promise<any[]> {
               return Promise.resolve(fake_csvEntries)
          }
     }

     class Validatorstub implements SchemaValidator {
          async validate(schema: AppSchema.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors> {
               return null
          }
     }

     class MeasurementServices implements Pick<IMeasurementsService, 'create'>{
          create(params: IMeasurementsService.Params.Create, f: boolean): Promise<MeasurementView> {
               return Promise.resolve(MakeFakeMeasurement())
          }
     }

     class StationRepositoryStub implements Pick<IStationRepository,'findWithAddress_id'>{
          findWithAddress_id(station_id: string, address_id: string): Promise<Station> {
               return Promise.resolve(MakeFakeStation())
          }
     }

     const reader = new CsvReaderStub();
     const validator = new Validatorstub();
     const services = new MeasurementServices();
     const stationRepository = new StationRepositoryStub();
     const sut = new CreateMeasurementsController(reader, validator, services, stationRepository);

     return { sut, validator, services, reader, stationRepository, fake_csvEntries }
}

const MakeRequestWitFiles= (fields ?: Partial<{ params: Record<string,string>, files: any, user: UserView }>) =>{
     return MakeRequest({
          files:{ csv_entry: [{ buffer: Buffer.alloc(200,"Simulando um CSV") }]},
          params: { station_id: "any_station_id" },
          user: new UserView(MakeFakeUser({role: UsersRole.Basic},), MakeFakeAddress()),
          ...fields
     })
}
describe("Admin's CreateMultiplesMeasurementsController", () =>{

     test("Should return 401 if no address are related to the user instace ", async() =>{
          const { sut } = makeSut();
          const respo = await sut.handler(MakeRequestWitFiles({
               user: new UserView(MakeFakeUser({role: UsersRole.Basic}),null),
               params: { station_id: "foregin_station"}}))
          expect(respo).toEqual(Unauthorized())
     })


     test("Should return 403 if invalid station_id or doest belongs to user address domain", async() =>{
          const { sut, stationRepository } = makeSut();
          
          jest.spyOn(stationRepository, 'findWithAddress_id').mockImplementationOnce( ()=>{
               return Promise.resolve(null)
          })
          const respo = await sut.handler(MakeRequestWitFiles({ 
               user: new UserView(MakeFakeUser({role: UsersRole.Basic},), MakeFakeAddress()),
               params: { station_id: "foregin_station"}}))
          expect(respo).toEqual(Forbidden('Usuário inelegível para realizar essa interação'))
     })

     test("Should return 404 if no files were provided", async() =>{
          const { sut } = makeSut();
          var respo = await sut.handler(MakeRequestWitFiles({files:null}))
          expect(respo).toEqual(NotFound("Arquivo .Csv não encontrado."))

          respo = await sut.handler(MakeRequestWitFiles({files:{}}))
          expect(respo).toEqual(NotFound("Arquivo .Csv não encontrado."))

          respo = await sut.handler(MakeRequestWitFiles({files:{csv_entry:[]}}))
          expect(respo).toEqual(NotFound("Arquivo .Csv não encontrado."))
     })

     test("Should throw 400 if Malformed csv File", async() =>{
          const { sut, reader } = makeSut();

          jest.spyOn(reader, 'read').mockImplementationOnce(()=>{
               return Promise.reject( new CsvReaderErros.InvalidCsvFile(new Error("Qualquer coisa")))
          })
          const respo = await sut.handler(MakeRequestWitFiles());
          expect(respo).toEqual(BadRequest(new CsvReaderErros.InvalidCsvFile(new Error("Qualquer coisa"))));
       
     })

     test("Should throw error if unknows error", async() =>{
          const { sut, reader } = makeSut();
          jest.spyOn(reader, 'read').mockImplementationOnce(()=>{
               return Promise.reject( new Error('Erro desconhecido'))
          })
          const respo = sut.handler(MakeRequestWitFiles());
          await expect(respo).rejects.toThrow(new Error("Erro desconhecido"));
     })

     test("Should call reader with correct values", async() =>{
          const { sut, reader } = makeSut();
          const validatorSpy = jest.spyOn(reader, 'read')
          await sut.handler(MakeRequestWitFiles());
          expect(validatorSpy).toHaveBeenCalledTimes(1);
          expect(validatorSpy).toHaveBeenCalledWith( Buffer.alloc(200,"Simulando um CSV")) 
     })

     test("Should call validator with correct values", async() =>{

          const { sut, validator, fake_csvEntries } = makeSut();
          const validatorSpy = jest.spyOn(validator, 'validate');

          const req = MakeRequestWitFiles()
          await sut.handler(req);

          expect(validatorSpy).toHaveBeenCalledTimes(1);
          expect(validatorSpy).toHaveBeenCalledWith(
               Measurement_CreateBodySchema,
               { ...fake_csvEntries[0],  created_at: `${fake_csvEntries[0].date} ${fake_csvEntries[0].hour}` }
          ) 
       
     })

     test("Should return 400 in case validator return a list of conflicts", async() =>{
          const { sut, validator } = makeSut();

          jest.spyOn(validator, 'validate').mockImplementation( (): Promise<SchemaValidator.Errors | null> => {
               return Promise.resolve(
                    {
                         temperature: "Temperatura contem valor invalido",
                         windSpeed: "Velocidade do vento é obrigatorio" 
                    })
          })  

          const respo = await sut.handler(MakeRequestWitFiles());
          expect(respo).toEqual(Unprocessable(
               {
                    temperature: "Temperatura contem valor invalido", 
                    windSpeed: "Velocidade do vento é obrigatorio" 
               }, "O Arquivo .Csv Contem dados insatisfatórios"))
     })

     test("Should return 400 in of invalid windDirection value", async() =>{
          const { sut, reader, fake_csvEntries } = makeSut();

          jest.spyOn(reader, 'read').mockImplementationOnce(()=>{
               return Promise.resolve(fake_csvEntries.map((m)=>({...m, windDirection: "invalid_wind_direction"})))
          })

          const respo = await sut.handler(MakeRequestWitFiles());
          expect(respo).toEqual(Unprocessable(
               {
                    windDirection: new InvalidWindDirectionError(CardialPointsList).message
               }, "O Arquivo .Csv Contem dados insatisfatórios"))
     })

 
     describe("Measurements Services", () =>{

          test("Should call measurements Services with correct values ", async() =>{
               
               const { sut, services, validator, fake_csvEntries } = makeSut()
               jest.spyOn(validator, 'validate').mockImplementationOnce( async (schema: AppSchema.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors> => {
                    params.temperature = 88; // modifing temperature for example
                    return Promise.resolve(null)
               })
               
               const createSpy = jest.spyOn(services, 'create');
               await sut.handler(MakeRequestWitFiles({params:{ station_id: 'station_id_provided'}}));
               expect(createSpy)
               .toHaveBeenCalledWith({ 
                    ...fake_csvEntries[0], 
                    created_at: `${fake_csvEntries[0].date} ${fake_csvEntries[0].hour}`,
                    temperature: 88, station_id: 'station_id_provided' },true) 
          })

          test("Should return 404 if invalid station_id", async() =>{
               const { sut, services } = makeSut();
               
               jest.spyOn(services, 'create').mockImplementationOnce( () =>{
                    return Promise.reject(new StationNotFoundError)
               })
               const respo = await sut.handler(MakeRequestWitFiles({params: { station_id: "Invalid_station_id"}}))
               expect(respo).toEqual(NotFound(new StationNotFoundError()))
          })
     

          test("Should return 400 if duplicity error came from create service, ( if it is a validation problems, meas validator should be refactored ) ", async() =>{

               const { sut, services } = makeSut()
               
               jest.spyOn(services, 'create').mockImplementationOnce(async()=>{
                    throw new MeasurementsDuplicatedError()
               });
               const result = await sut.handler(MakeRequestWitFiles({params:{ station_id: 'any_station_id'}}));
               expect(result).toEqual(BadRequest(new MeasurementsDuplicatedError()))

          }) 
          
     })

})