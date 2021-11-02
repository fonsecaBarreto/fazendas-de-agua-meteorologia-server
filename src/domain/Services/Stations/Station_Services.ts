import { start } from "repl";
import { Station } from "../../Entities/Station";
import { AddressNotFoundError } from "../../Errors/AddressesErrors";
import { StationNotFoundError } from "../../Errors/StationsErrors";
import { IIdGenerator } from "../../Interfaces";
import { IAddressRepository } from "../../Interfaces/repositories/IAddressRepository";
import { IStationRepository } from "../../Interfaces/repositories/IStationRepository";
import { StationView } from "../../Views/StationView";

export namespace IStationService {
     export namespace Params {

          export type Create ={
               longitude: number, latitude: number, altitude: number,
               description?: string,
               address_id:string,
          }

          export interface Update extends Omit<Create,'address_id'>{}

     }
}

export interface IStationService {
     create(params: IStationService.Params.Create): Promise<StationView>
     update(id:string, params:  IStationService.Params.Update): Promise<StationView> 
     find(id:string, mpage: number): Promise<StationView>
     remove(id:string): Promise<void>
}

export class StationsServices implements IStationService{
     constructor(
          private readonly idGenerator: IIdGenerator,
          private readonly _stationsRepository: Omit<IStationRepository, 'findMeasurementsByInterval' | 'findWithAddress_id'>,
          private readonly _addressRepository: Pick<IAddressRepository,'find'>
     ){}

     async create(params: IStationService.Params.Create): Promise<StationView> {
          const { longitude, latitude, altitude, description, address_id } = params

          const addressExists = await this._addressRepository.find(address_id)
          if(!addressExists) throw new AddressNotFoundError()

          const id = this.idGenerator.gen()
          const station: Station = { id, longitude, latitude, altitude, description, address_id };

          await this._stationsRepository.upsert(station)

          return new StationView(station, addressExists )

     }

     async update(id: string, params: IStationService.Params.Update): Promise<StationView> {
          const { longitude, latitude, altitude, description } = params

          const station = await this._stationsRepository.find(id)
          if(!station) throw new StationNotFoundError()

          station.longitude = longitude
          station.latitude = latitude
          station.altitude = altitude
          if(description) { station.description = description }

          await this._stationsRepository.upsert(station)

          return new StationView(station)
     }

     async find(id: string, mpage = -1): Promise<StationView> {
          const MEASUREMENTS_LIMIT = 60;

          const station: StationView = await this._stationsRepository.findStation(id)
          if(!station) return null;

          if(mpage !== -1){
               const offset = MEASUREMENTS_LIMIT * mpage;
               const mm = await this._stationsRepository.findMeasurements(id, offset, MEASUREMENTS_LIMIT)
               if(mm != null) station.setMeasurements(mm);
          }
          /* So deve ser Fornecido medições, caso o indice para a paginação tenha sido fornecido. */

          return station;
     }

     async remove(id: string): Promise<void> {
          const wasDeleted = await this._stationsRepository.remove(id)
          if(!wasDeleted) throw new StationNotFoundError()
     }

}

