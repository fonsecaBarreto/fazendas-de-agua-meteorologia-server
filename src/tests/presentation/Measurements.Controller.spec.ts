import { CreateMultiplesMeasurementsController } from '../../presentation/Controllers/V1/Admin/Measurements.Controller'
import {AppSchema, SchemaValidator } from '../../libs/ApplicatonSchema/SchemaValidator'
import { CsvReader, Errors as CsvReaderErros, Errors } from '../../libs/CsvReader/'
import { MakeFakeMeasurement } from '../mocks/entities/MakeMeasurement'
import { IMeasurementsService } from '../../domain/Services/Stations/Measurements_Services'
import { MeasurementView } from '../../domain/Views/MeasurementView'
import { MakeRequest } from './mocks/MakeRequest'
import { BadRequest, NotFound, Ok, Unprocessable } from '../../presentation/Protocols/http-helper'
import { Measurement_CreateBodySchema } from '../../presentation/Models/Schemas/MeaserumentsSchemas'
import { IMeasurementsRepository, IStationRepository } from '../../domain/Interfaces'
import { Station } from '../../domain/Entities/Station'
import { MakeFakeStation } from '../mocks/entities/MakeStation'
import { StationNotFoundError } from '../../domain/Errors/StationsErrors'
import { MeasurementsDuplicatedError } from '../../domain/Errors/MeasurementsErrors'
import { CsvConflict, MultiplesMeasurementsValidator } from '../../presentation/Controllers/V1/Helpers/MultiplesMeasurementsValidator'
import { Measurement } from '../../domain/Entities/Measurements'

const makeSut  =  () =>{

     const fakeMeasurements = [
          MakeFakeMeasurement(),
          MakeFakeMeasurement()
     ]

     class Validatorstub implements SchemaValidator {
          async validate(schema: AppSchema.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors> {
               return null
          }
     }

     class CsvReaderStub implements CsvReader {
          read(file: Buffer): Promise<any[]> {
               return Promise.resolve(fakeMeasurements)
          }
     }

     class MeasurementServices implements Pick<IMeasurementsService, 'create'>{
          create(params: IMeasurementsService.Params.Create): Promise<MeasurementView> {
               return Promise.resolve(MakeFakeMeasurement())
          }
     }



     class StationRepositoryStub implements Pick<IStationRepository,'find'>{
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

     return { sut, mmValidatorStub, validator, services, reader, fakeMeasurements, stationRepository }
}

const MakeRequestWitFiles= (station_id?:string) =>{
     return MakeRequest({
          files:{ csv_entry: [{ buffer: Buffer.alloc(200,"Qualquer coisa") }]},
          params: { station_id: station_id || "any_station_id"}
     })
}
describe("Admin's CreateMultiplesMeasurementsController", () =>{

     test("Should return 404 if invalid station_id", async() =>{
          const { sut, stationRepository } = makeSut();

          jest.spyOn(stationRepository, 'find').mockImplementationOnce( ()=>{
               return Promise.resolve(null)
          })
          const respo = await sut.handler(MakeRequest())
          expect(respo).toEqual(NotFound(new StationNotFoundError()))
     })

     test("Should return 404 if no files were provided", async() =>{
          const { sut } = makeSut();
          var respo = await sut.handler(MakeRequest({files:null}))
          expect(respo).toEqual(NotFound("Arquivo .Csv não encontrado."))

          respo = await sut.handler(MakeRequest({files:{}}))
          expect(respo).toEqual(NotFound("Arquivo .Csv não encontrado."))

          respo = await sut.handler(MakeRequest({files:{csv_entry:[]}}))
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

          const { sut, mmValidatorStub, fakeMeasurements } = makeSut();
          const validatorSpy = jest.spyOn(mmValidatorStub, 'execute');

          const req = MakeRequestWitFiles()
          await sut.handler(req);

          expect(validatorSpy).toHaveBeenCalledTimes(1);
          expect(validatorSpy).toHaveBeenCalledWith(fakeMeasurements, req.params.station_id, false) 
       
     })

     test("Should return 400 in case mmvalidator return a list of conflicts", async() =>{
          const { sut, mmValidatorStub, fakeMeasurements } = makeSut();

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

          const { sut, services, validator, fakeMeasurements } = makeSut()
          // In Validator could happen something like the 'sanitization os the atribute', so, its important to make sure that it has been called by reference'
          jest.spyOn(validator, 'validate').mockImplementationOnce( async (schema: AppSchema.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors> => {
               params.temperature = 88; // modifing temperature for example
               return Promise.resolve(null)
          })

          const createSpy = jest.spyOn(services, 'create');
          await sut.handler(MakeRequestWitFiles('station_id_provided'));
          expect(createSpy).toHaveBeenNthCalledWith(1, { ...fakeMeasurements[0], temperature: 88, station_id: 'station_id_provided' }) 
          expect(createSpy).toHaveBeenNthCalledWith(2, { ...fakeMeasurements[1], station_id: 'station_id_provided' }) 

     })


     test("Should thorw error if duplicity error came from create service, ( if it is a validation problems, meas validator should be refactored ) ", async() =>{

          const { sut, services } = makeSut()
          
          jest.spyOn(services, 'create').mockImplementationOnce(async()=>{
               throw new MeasurementsDuplicatedError()
          });
          const result = sut.handler(MakeRequestWitFiles('any_station_id'));

          await expect(result).rejects.toThrow(new MeasurementsDuplicatedError());
     })

     test("Should return 200 ", async() =>{
          const { sut } = makeSut();
          const respo = await sut.handler(MakeRequestWitFiles());
          expect(respo.status).toBe(200)
          expect(respo.body).toHaveLength(2)
     }) 

     
})