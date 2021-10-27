import { IdGeneratorStub } from "../../../tests/mocks/vendors";import { Station } from "../../Entities/Station";
import { CardialPoints, Measurement } from "../../Entities/Measurements";
import { IMeasurementsRepository, IStationRepository } from "../../Interfaces/repositories";
import { MeasurementView } from "../../Views/MeasurementView";
import { StationNotFoundError } from "../../Errors/StationsErrors";
import { StationView } from "../../Views/StationView";
import { InvalidWindDirectionError, MeasurementNotFoundError, MeasurementsDuplicatedError } from "../../Errors/MeasurementsErrors";

export namespace IMeasurementsService {
     export namespace Params {
          export type Create ={
               station_id: string
               created_at: Date,
               temperature: number
               airHumidity: number,
               windSpeed: number,
               windDirection: CardialPoints,
               rainVolume: number,
               accRainVolume: number,
          }
     }
}

export interface IMeasurementsService {
     create(params: IMeasurementsService.Params.Create, f:boolean): Promise<MeasurementView>
     find(id:string): Promise<MeasurementView>
     remove(id:string): Promise<void>
}

export class MeasurementsService implements IMeasurementsService{
     constructor(
          private readonly idGenerator: IdGeneratorStub,
          private readonly _measurementsRepository: IMeasurementsRepository,
          private readonly _stationsRepository: Pick<IStationRepository, 'find'>,
     ){}

     async create(params: IMeasurementsService.Params.Create, force: boolean = false): Promise<MeasurementView> {

          const { temperature, airHumidity, rainVolume, accRainVolume,  windSpeed, windDirection, station_id, created_at } = params

          const stationExists = await this._stationsRepository.find(station_id);
          if(!stationExists) throw new StationNotFoundError()

          // if not forced it will check and throw error duplicated date
          // Otherwise repostory is always going to overwrite by date

          if(force === false){
               const isDuplicated = await this._measurementsRepository.findByDate(station_id, created_at) // 
               if(isDuplicated) throw new MeasurementsDuplicatedError()
          }

          const station = new StationView(stationExists)

          const id = this.idGenerator.gen()

          const measurements: Measurement = { 
               id, station_id,
               temperature, airHumidity, rainVolume,  windSpeed, windDirection, accRainVolume, 
               coordinates: station.getCoordinates(),
               created_at
           };
          
          await this._measurementsRepository.add(measurements)

          return new MeasurementView(measurements)
     }

     async find(id: string): Promise<MeasurementView> {
          const measurement = await this._measurementsRepository.find(id)
          return measurement ? new MeasurementView(measurement) : null;
     }

     async remove(id: string): Promise<void> {
          const wasDeleted = await this._measurementsRepository.remove(id)
          if(!wasDeleted) throw new MeasurementNotFoundError()
     }

}