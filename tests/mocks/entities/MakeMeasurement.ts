import { v4 } from "uuid";
import { CardialPoints, Coordinates, Measurement } from '../../../src/domain/Entities/Measurements';

export function MakeFakeCoordinates():Coordinates {
     return [ 123, 123, 123 ]
}

const cardinalList = Object.values(CardialPoints)

export function MakeFakeMeasurement(params?: Partial<Measurement>): Measurement {
     return ({
          id: v4(),
          station_id: 'any_staion_id',
          coordinates: MakeFakeCoordinates(),
          created_at: new Date(),
          temperature: Math.floor(Math.random() * (40 - 26) + 26),
          airHumidity: Math.floor(Math.random() * (2 - 0) + 0),
          windSpeed: Math.floor(Math.random() * (40 - 26) + 26),
          windDirection: cardinalList[ Math.floor( Math.random() * cardinalList.length )],
          rainVolume: Math.floor(Math.random() * (10 - 0) + 0),
          accRainVolume: Math.floor(Math.random() * (10 - 0) + 0),
          ...params
     })
}