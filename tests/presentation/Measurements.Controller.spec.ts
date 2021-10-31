import { CreateMultiplesMeasurementsController } from '../../src/presentation/Controllers/V1/Measurement/Multiples_Measurements_Upload.Controller'
import {AppSchema, SchemaValidator } from '../../src/libs/ApplicatonSchema/SchemaValidator'
import { CsvReader, Errors as CsvReaderErros, Errors } from '../../src/libs/CsvReader/'
import { MakeFakeMeasurement } from '../mocks/entities/MakeMeasurement'
import { IMeasurementsService } from '../../src/domain/Services/Stations/Measurements_Services'
import { MeasurementView } from '../../src/domain/Views/MeasurementView'
import { MakeRequest } from './mocks/MakeRequest'
import { BadRequest, Forbidden, NotFound, Ok, Unauthorized, Unprocessable } from '../../src/presentation/Protocols/http-helper'
import { IMeasurementsRepository, IStationRepository } from '../../src/domain/Interfaces'
import { Station } from '../../src/domain/Entities/Station'
import { MakeFakeStation } from '../mocks/entities/MakeStation'
import { StationNotFoundError } from '../../src/domain/Errors/StationsErrors'
import { MeasurementsDuplicatedError } from '../../src/domain/Errors/MeasurementsErrors'
import { CsvConflict, MultiplesMeasurementsValidator } from '../../src/presentation/Controllers/V1/Measurement/Helpers/MultiplesMeasurementsValidator'
import { Measurement } from '../../src/domain/Entities/Measurements'
import { MakeFakeUser } from '../mocks/entities/MakeUser'
import { UsersRole } from '../../src/domain/Entities/User'
import { UserView } from '../../src/domain/Views/UserView'
import { MakeFakeAddress } from '../mocks/entities/MakeAddress'

const makeSut  =  () =>{

     const fakeMeasurements = [
          MakeFakeMeasurement(),
          MakeFakeMeasurement()
     ]

     const fake_csvEntries = [ 
          { date: "01/01/2020",  hour: "00:00:00", temperature: "32", airHumidity: "1", windSpeed: "10", windDirection: "NW", rainVolume: "2", accRainVolume:"20" },
          { date: "01/01/2021",  hour: "00:00:00", temperature: "32", airHumidity: "1", windSpeed: "10", windDirection: "NW", rainVolume: "2", accRainVolume:"20" }
     ]

     class Validatorstub implements SchemaValidator {
          async validate(schema: AppSchema.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors> {
               return null
          }
     }

     class CsvReaderStub implements CsvReader {
          read(file: Buffer): Promise<any[]> {
               return Promise.resolve(fake_csvEntries)
          }
     }

     class MeasurementServices implements Pick<IMeasurementsService, 'create'>{
          create(params: IMeasurementsService.Params.Create): Promise<MeasurementView> {
               return Promise.resolve(MakeFakeMeasurement())
          }
     }

     class StationRepositoryStub implements Pick<IStationRepository,'find' | 'findWithAddress_id'>{
          findWithAddress_id(station_id: string, address_id: string): Promise<Station> {
               return Promise.resolve(MakeFakeStation())
          }
          find(id: string): Promise<Station> {
               return Promise.resolve(MakeFakeStation())
          }
     }

     class MeasurementsRepositoryStub implements Pick<IMeasurementsRepository,'findByDate'> {
          async findByDate(station_id: string, created_at: Date): Promise<Measurement> {
               return null
          }
     }

     const reader = new CsvReaderStub();
     const validator = new Validatorstub();
     const services = new MeasurementServices()
     const stationRepository = new StationRepositoryStub()
     const measurementsRepository = new MeasurementsRepositoryStub()
     const mmValidatorStub = new MultiplesMeasurementsValidator(validator,measurementsRepository)
     const sut = new CreateMultiplesMeasurementsController(reader, mmValidatorStub, services, stationRepository)
     return { sut, mmValidatorStub, validator, services, reader, fakeMeasurements, stationRepository, fake_csvEntries}
}

const MakeRequestWitFiles= (fields ?: Partial<{ params: Record<string,string>, files: any, user: UserView }>) =>{
     return MakeRequest({
          files:{ csv_entry: [{ buffer: Buffer.alloc(200,"Qualquer coisa") }]},
          params: { station_id: "any_station_id" },
          user: new UserView(MakeFakeUser({role: UsersRole.Admin})),
          ...fields
     })
}
describe("Admin's CreateMultiplesMeasurementsController", () =>{



     describe("Admins User", () =>{
          test("Should return 404 if invalid station_id", async() =>{
               const { sut, stationRepository } = makeSut();

               jest.spyOn(stationRepository, 'find').mockImplementationOnce( ()=>{
                    return Promise.resolve(null)
               })
               const respo = await sut.handler(MakeRequestWitFiles({params: { station_id: "Invalid_station_id"}}))
               expect(respo).toEqual(NotFound(new StationNotFoundError()))
          })
     })

     describe("Basic User", () =>{

          test("Should return 401 if no address are related to the user ( for reasons i dont know )", async() =>{
               const { sut, stationRepository } = makeSut();
               
               jest.spyOn(stationRepository, 'findWithAddress_id').mockImplementationOnce( ()=>{
                    return Promise.resolve(null)
               })
               const respo = await sut.handler(MakeRequestWitFiles({ user: new UserView(MakeFakeUser({role: UsersRole.Basic})), params: { station_id: "foregin_station"}}))
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
          expect(validatorSpy).toHaveBeenCalledWith( Buffer.alloc(200,"Qualquer coisa")) 
     })

     test("Should call mmvalidator with correct values", async() =>{

          const { sut, mmValidatorStub, fake_csvEntries } = makeSut();
          const validatorSpy = jest.spyOn(mmValidatorStub, 'execute');

          const req = MakeRequestWitFiles()
          await sut.handler(req);

          expect(validatorSpy).toHaveBeenCalledTimes(1);
          expect(validatorSpy).toHaveBeenCalledWith({
               list: fake_csvEntries.map((m)=>({...m, created_at: `${m.date} ${m.hour}`})),
               station_id: req.params.station_id, skipDublicityCheck: false}
          ) 
       
     })

     test("Should return 400 in case mmvalidator return a list of conflicts", async() =>{
          const { sut, mmValidatorStub } = makeSut();

          jest.spyOn(mmValidatorStub, 'execute').mockImplementation( (): Promise<CsvConflict> => {
               return Promise.resolve(
                    {
                         0: { temperature: "Temperatura contem valor invalido",
                              windSpeed: "Velocidade do vento é obrigatorio" },
                         1: 'Pode ser um estring tambem'
                    }  )
          })  

          const respo = await sut.handler(MakeRequestWitFiles());
          expect(respo).toEqual(Unprocessable(
               {
                     0: {  temperature: "Temperatura contem valor invalido", windSpeed: "Velocidade do vento é obrigatorio" },
                     1: 'Pode ser um estring tambem' 
               }, "O Arquivo .Csv Contem dados insatisfatórios"))
     })


     test("Should call measurements Services with correct values ", async() =>{

          const { sut, services, validator, fake_csvEntries } = makeSut()
          // In Validator could happen something like the 'sanitization os the atribute', so, its important to make sure that it has been called by reference'
          jest.spyOn(validator, 'validate').mockImplementationOnce( async (schema: AppSchema.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors> => {
               params.temperature = 88; // modifing temperature for example
               return Promise.resolve(null)
          })

          const createSpy = jest.spyOn(services, 'create');
          await sut.handler(MakeRequestWitFiles({params:{ station_id: 'station_id_provided'}}));
          expect(createSpy).toHaveBeenNthCalledWith(1, { ...fake_csvEntries[0], created_at: `${fake_csvEntries[0].date} ${fake_csvEntries[0].hour}`, temperature: 88, station_id: 'station_id_provided' },false) 
          expect(createSpy).toHaveBeenNthCalledWith(2, { ...fake_csvEntries[1], created_at: `${fake_csvEntries[1].date} ${fake_csvEntries[1].hour}`, station_id: 'station_id_provided' }, false) 

     })


     test("Should thorw error if duplicity error came from create service, ( if it is a validation problems, meas validator should be refactored ) ", async() =>{

          const { sut, services } = makeSut()
          
          jest.spyOn(services, 'create').mockImplementationOnce(async()=>{
               throw new MeasurementsDuplicatedError()
          });
          const result = sut.handler(MakeRequestWitFiles({params:{ station_id: 'any_station_id'}}));

          await expect(result).rejects.toThrow(new MeasurementsDuplicatedError());
     })

     test("Should return 200 ", async() =>{
          const { sut } = makeSut();
          const respo = await sut.handler(MakeRequestWitFiles());
          expect(respo.status).toBe(204)
       /*    expect(respo.body).toHaveLength(2) */
     }) 

     
})