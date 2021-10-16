import { CreateMultiplesMeasurementsController } from '../../presentation/Controllers/V1/Admin/Measurements.Controller'
import {AppSchema, SchemaValidator } from '../../libs/ApplicatonSchema/SchemaValidator'
import { CsvReader, Errors as CsvReaderErros, Errors } from '../../libs/CsvReader/'
import { MakeFakeMeasurement } from '../mocks/entities/MakeMeasurement'
import { IMeasurementsService } from '../../domain/Services/Stations/Measurements_Services'
import { MeasurementView } from '../../domain/Views/MeasurementView'
import { MakeRequest } from './mocks/MakeRequest'
import { BadRequest, NotFound, Ok, Unprocessable } from '../../presentation/Protocols/http-helper'
import { Measurement_CreateBodySchema } from '../../presentation/Models/Schemas/MeaserumentsSchemas'
import exp from 'constants'
import { serialize } from 'v8'

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


     const reader = new CsvReaderStub();
     const validator = new Validatorstub();
     const services = new MeasurementServices()
     const sut = new CreateMultiplesMeasurementsController(reader, validator, services)

     return { sut, validator, services, reader, fakeMeasurements}
}

const MakeRequestWitFiles= () =>{
     return MakeRequest({files:{
          csv_entry: Buffer.alloc(200,"Qualquer cois")
     }})
}
describe("Admin's CreateMultiplesMeasurementsController", () =>{
     test("Should return 404 if no files where provided", async() =>{
          const { sut } = makeSut();
          const respo = await sut.handler(MakeRequest())
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


     test("Should call validator with correct values", async() =>{
          const { sut, validator, fakeMeasurements } = makeSut();

          const validatorSpy = jest.spyOn(validator, 'validate')
          const respo = await sut.handler(MakeRequestWitFiles());
          expect(validatorSpy).toHaveBeenCalledTimes(2);
          expect(validatorSpy).toHaveBeenNthCalledWith(1, Measurement_CreateBodySchema, fakeMeasurements[0]) 
          expect(validatorSpy).toHaveBeenNthCalledWith(2, Measurement_CreateBodySchema, fakeMeasurements[1]) 
      
     })

     test("Should return 400 in case validator return a list of erros", async() =>{
          const { sut, validator, fakeMeasurements } = makeSut();

          jest.spyOn(validator, 'validate').mockImplementation( (): Promise<SchemaValidator.Errors> => {
               return Promise.resolve(
                    {
                         temperature: "Temperatura contem valor invalido",
                         windSpeed: "Velocidade do vento é obrigatorio"
                    }
               )
          })  

          const respo = await sut.handler(MakeRequestWitFiles());
          expect(respo).toEqual(Unprocessable(
               {
                     0: {  temperature: "Temperatura contem valor invalido", windSpeed: "Velocidade do vento é obrigatorio" },
                     1: {  temperature: "Temperatura contem valor invalido", windSpeed: "Velocidade do vento é obrigatorio" } 
               },
               "O Arquivo .Csv Contem dados insatisfatórios"))
     })


     test("Should call measurements Services with correct values ", async() =>{

          const { sut, services, validator, fakeMeasurements } = makeSut()
          
          jest.spyOn(validator, 'validate').mockImplementationOnce( async (schema: AppSchema.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors> => {
               params.temperature = 88;
               return Promise.resolve(null)
          })

          const createSpy = jest.spyOn(services, 'create');
          await sut.handler(MakeRequestWitFiles());
          expect(createSpy).toHaveBeenLastCalledWith({ ...fakeMeasurements[1] }) 

     })

    
     test("Should return 200 ", async() =>{
          const { sut } = makeSut();
          const respo = await sut.handler(MakeRequestWitFiles());
          expect(respo).toEqual( Ok())
     })
     
     
})