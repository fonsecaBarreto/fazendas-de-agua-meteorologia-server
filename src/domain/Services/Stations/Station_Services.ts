import { address } from "faker";
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
     list(): Promise<Station[]>
     remove(id:string): Promise<void>
}

export class StationsServices implements IStationService{
     constructor(
          private readonly idGenerator: IIdGenerator,
          private readonly _stationsRepository: IStationRepository,
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

     async find(id: string, mpage = 0): Promise<StationView> {
          const limit = 25;
          const offset = limit * mpage;

          const station: StationView = await this._stationsRepository.findStation(id)
          if(!station) return null;

          const measurements = await this._stationsRepository.findMeasurements(id, offset, limit)
          station.setMeasurements(measurements)

          return station;
     }

     async list(): Promise<Station[]> {
          const stations: Station[] = await this._stationsRepository.list()
          return stations;
     }

     async remove(id: string): Promise<void> {
          const wasDeleted = await this._stationsRepository.remove(id)
          if(!wasDeleted) throw new StationNotFoundError()
     }

}