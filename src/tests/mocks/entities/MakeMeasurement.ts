import { v4 } from "uuid";
import { Coordinates, Measurements } from "../../../domain/Entities/Measurements";
import faker from 'faker'

export function MakeFakeCoordinates(fields?:Partial<Coordinates>):Coordinates {
     return ({
          latitude: 123,
          altitude: 123,
          longitude: 123,
          ...fields
     })
}

export function MakeFakeMeasurement(params?: Partial<Measurements>): Measurements {
     return ({
          id: v4(),
          temperature: 30,
          airHumidity: 2,
          rainVolume: 32,
          windSpeed: 33,
          windDirection: 22,
          coordinates: MakeFakeCoordinates(),
          station_id: 'any_staion_id',
          ...params
     })
}