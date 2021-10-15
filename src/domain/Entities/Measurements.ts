import { BaseEntity } from "./BaseEntity";

export type Coordinates = {
     latitude: number,
     longitude: number,
     altitude: number,
}

export interface Measurement extends BaseEntity{
     temperature: number
     airHumidity: number,
     rainVolume: number,
     windSpeed: number,
     windDirection: number,
     coordinates: Coordinates
     station_id: string,
}