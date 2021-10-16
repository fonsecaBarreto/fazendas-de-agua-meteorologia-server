import { v4 } from "uuid";
import { Coordinates, Measurement } from "../../../domain/Entities/Measurements";
import faker from 'faker'

export function MakeFakeCoordinates(fields?:Partial<Coordinates>):Coordinates {
     return ({
          latitude: 123,
          altitude: 123,
          longitude: 123,
          ...fields
     })
}

export function MakeFakeMeasurement(params?: Partial<Measurement>): Measurement {
     return ({
          id: v4(),
          temperature: Math.floor(Math.random() * (40 - 26) + 26),
          airHumidity: Math.floor(Math.random() * (2 - 0) + 0),
          rainVolume: Math.floor(Math.random() * (10 - 0) + 0),
          windSpeed: Math.floor(Math.random() * (40 - 26) + 26),
          windDirection: 22,
          coordinates: MakeFakeCoordinates(),
          station_id: 'any_staion_id',
          ...params
     })
}