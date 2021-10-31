import { Measurement } from '../../src/domain/Entities/Measurements';
import { InvalidWindDirectionError, MeasurementsDuplicatedError } from '../../src/domain/Errors/MeasurementsErrors';
import { IMeasurementsRepository } from '../../src/domain/Interfaces';
import { AppSchema, SchemaValidator } from '../../src/libs/ApplicatonSchema/SchemaValidator';
import { MakeFakeMeasurement } from '../mocks/entities/MakeMeasurement';
import { Measurement_CreateBodySchema } from '../../src/presentation/Models/Schemas/MeaserumentsSchemas';
import { CardialPointsList, MultiplesMeasurementsValidator } from '../../src/presentation/Controllers/V1/Measurement/Helpers/MultiplesMeasurementsValidator'

const fakeMeasurements = [...Array(3)].map(m=>MakeFakeMeasurement())
const makeSut = () =>{

     class Validatorstub implements SchemaValidator {
          async validate(schema: AppSchema.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors> {
               return null
          }
     }

     class MeasurementsRepositoryStub implements Pick<IMeasurementsRepository,'findByDate'> {
          async findByDate(station_id: string, created_at: Date): Promise<Measurement> {
               return null
          }

     }

     const validator = new Validatorstub();
     const measurementsRepository = new MeasurementsRepositoryStub()
     const sut = new MultiplesMeasurementsValidator(validator, measurementsRepository)
     return { sut, validator, measurementsRepository}
}

describe("MultiplesMeasurementsValidator", () =>{

     const makeFakeParams = ( fields?: Partial<MultiplesMeasurementsValidator.Params>): MultiplesMeasurementsValidator.Params =>{
          return {
               list: fakeMeasurements,
               station_id: 'any_station_id', 
               skipDublicityCheck: false,
               ...fields
          }
     }
          
     test("Should call validator with correct values", async() =>{
          const { sut, validator } = makeSut();

          const params = makeFakeParams();

          const validatorSpy = jest.spyOn(validator, 'validate')

          await sut.execute(params);

          expect(validatorSpy).toHaveBeenCalledTimes(3);
          expect(validatorSpy).toHaveBeenNthCalledWith(1, Measurement_CreateBodySchema, fakeMeasurements[0]) 
          expect(validatorSpy).toHaveBeenNthCalledWith(2, Measurement_CreateBodySchema, fakeMeasurements[1]) 
          expect(validatorSpy).toHaveBeenNthCalledWith(3, Measurement_CreateBodySchema, fakeMeasurements[2]) 
     })



     test("Should return a struct of conflict in case validator return a its list of 'erros'", async() =>{
          const { sut, validator } = makeSut();

          jest.spyOn(validator, 'validate').mockImplementation( (): Promise<SchemaValidator.Errors> => {
               return Promise.resolve(
                    {
                         temperature: "Temperatura contem valor invalido",
                         windSpeed: "Velocidade do vento é obrigatorio"
                    }
               )
          })  

          const respo = await sut.execute(makeFakeParams());
          expect(respo).toEqual(
               {
                    0: {  temperature: "Temperatura contem valor invalido", windSpeed: "Velocidade do vento é obrigatorio" },
                    1: {  temperature: "Temperatura contem valor invalido", windSpeed: "Velocidade do vento é obrigatorio" },
                    2: {  temperature: "Temperatura contem valor invalido", windSpeed: "Velocidade do vento é obrigatorio" } 
               })
     })

     test("Shoudl return conflict if invalid cardialpoint were provided", async() =>{
          const { sut } = makeSut();
          const fakeList = [...Array(2)].map(m=>({...MakeFakeMeasurement(), windDirection: "invalid_wind_direaction"}))
          const respo = await sut.execute(makeFakeParams({list: fakeList}));

          expect(respo).toEqual(
               {
                    0: new InvalidWindDirectionError(CardialPointsList).message,
                    1:  new InvalidWindDirectionError(CardialPointsList).message
               })
     })
     

    test("Should not call measurements repository if skipcheck where required", async() =>{
          const { sut, measurementsRepository } = makeSut();
          const params = makeFakeParams({skipDublicityCheck:true});
          const findSpy = jest.spyOn(measurementsRepository, 'findByDate')
          await sut.execute(params);
          expect(findSpy).toHaveBeenCalledTimes(0);
     }) 

     test("Should call measurements repository with correct values", async() =>{
          const { sut, measurementsRepository } = makeSut();
          const params = makeFakeParams();
          const validatorSpy = jest.spyOn(measurementsRepository, 'findByDate')
          await sut.execute(params);
          expect(validatorSpy).toHaveBeenCalledTimes(3);
          expect(validatorSpy).toHaveBeenNthCalledWith(1, params.station_id, fakeMeasurements[0].created_at) 
          expect(validatorSpy).toHaveBeenNthCalledWith(2, params.station_id, fakeMeasurements[1].created_at) 
          expect(validatorSpy).toHaveBeenNthCalledWith(3, params.station_id, fakeMeasurements[2].created_at) 
     })  


     test("Should return a struct of conflict in case measuremets respoitory indicates duplicity", async() =>{
          const { sut, measurementsRepository } = makeSut();

          jest.spyOn(measurementsRepository, 'findByDate').mockImplementationOnce( (): Promise<Measurement> => {
               return Promise.resolve( MakeFakeMeasurement())
          })  

          const respo = await sut.execute(makeFakeParams());
          expect(respo).toEqual(
               {
                    0: new MeasurementsDuplicatedError().message 
               })
     })


     test("Should return a struct of conflict if both validations failed", async() =>{
          const { sut, validator, measurementsRepository } = makeSut();

          jest.spyOn(measurementsRepository, 'findByDate').mockImplementation( (): Promise<Measurement> => {
               return Promise.resolve( MakeFakeMeasurement())
          })  

          jest.spyOn(validator, 'validate').mockImplementationOnce( (): Promise<SchemaValidator.Errors> => {
               return Promise.resolve( {
                    temperature: "Temperatura contem valor invalido",
                    windDir: "Velocidade do vento é obrigatorio"
               })
          })  

          const respo = await sut.execute(makeFakeParams());
          expect(respo).toEqual(
               {
                    0: {
                         temperature: "Temperatura contem valor invalido",
                         windDir: "Velocidade do vento é obrigatorio",
                    },
                    1: new MeasurementsDuplicatedError().message,
                    2: new MeasurementsDuplicatedError().message
               })
     })
     test("Should return a empty struct ", async() =>{
          const { sut } = makeSut();
          const respo = await sut.execute(makeFakeParams());
          expect(respo).toEqual( {})
     }) 
})



