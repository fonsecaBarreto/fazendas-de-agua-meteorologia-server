import { IdGeneratorStub } from "../../../tests/mocks/vendors";import { Station } from "../../Entities/Station";
import { Measurement, Coordinates } from "../../Entities/Measurements";
import { IMeasurementsRepository, IStationRepository } from "../../Interfaces/repositories";
import { MeasurementView } from "../../Views/MeasurementView";
import { StationNotFoundError } from "../../Errors/StationsErrors";
import { StationView } from "../../Views/StationView";
import { MeasurementNotFoundError } from "../../Errors/MeasurementsErrors";

export namespace IMeasurementsService {
     export namespace Params {
          export type Create ={
               temperature: number
               airHumidity: number,
               rainVolume: number,
               windSpeed: number,
               windDirection: number,
               created_at: Date,
               station_id: string
          }
     }
}

export interface IMeasurementsService {
     create(params: IMeasurementsService.Params.Create): Promise<MeasurementView>
     find(id:string): Promise<MeasurementView>
     remove(id:string): Promise<void>
}

export class MeasurementsService implements IMeasurementsService{
     constructor(
          private readonly idGenerator: IdGeneratorStub,
          private readonly _measurementsRepository: IMeasurementsRepository,
          private readonly _stationsRepository: Pick<IStationRepository, 'find'>,
     ){}

     async create(params: IMeasurementsService.Params.Create): Promise<MeasurementView> {

          const { temperature, airHumidity, rainVolume,  windSpeed, windDirection, station_id, created_at } = params

          const stationExists = await this._stationsRepository.find(station_id);
          if(!stationExists) throw new StationNotFoundError()

          const station = new StationView(stationExists)

          const id = this.idGenerator.gen()

          const measurements: Measurement = { 
               id, 
               temperature, airHumidity, rainVolume,  windSpeed, windDirection,
               coordinates: station.getCoordinates(),
               station_id: station_id,
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