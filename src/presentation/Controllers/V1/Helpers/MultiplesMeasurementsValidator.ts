import { Measurement } from "../../../../domain/Entities/Measurements";
import { IMeasurementsRepository } from "../../../../domain/Interfaces";
import { SchemaValidator } from "../../../../libs/ApplicatonSchema/SchemaValidator"
import { Measurement_CreateBodySchema } from '../../../Models/Schemas/MeaserumentsSchemas'

export type CsvConflict = Record<string, SchemaValidator.Errors | string>
export const DUPLICITY_ERROR = "Já existe uma medição com mesma data para a mesma estação."

export namespace MultiplesMeasurementsValidator {
     export type Params = {
          list: any[],
          station_id:string, 
          skipDublicityCheck:boolean
     }
}
export class MultiplesMeasurementsValidator {
     constructor(
          private readonly _validator: SchemaValidator,
          private readonly _measurementsRepository: Pick<IMeasurementsRepository,'findByDate'>,
          ){ }

     public async execute(params: MultiplesMeasurementsValidator.Params): Promise<CsvConflict> {

          const { list, station_id, skipDublicityCheck } = params

          const conflits: CsvConflict = {}

          await Promise.all(list.map(async (entry, index) =>{

               const errors = await this._validator.validate(Measurement_CreateBodySchema, entry);
               if(errors) return conflits[index] = errors; // se houver erro no conteudo, sera retornado 

               if(skipDublicityCheck === false){ // caso force seja adotado, nao sera verificado.
                    const isDuplicated = await this._measurementsRepository.findByDate(station_id, entry.created_at) // 
                    if(isDuplicated) return conflits[index] = DUPLICITY_ERROR
               }

          }))

          return conflits
     }
}

export default MultiplesMeasurementsValidator