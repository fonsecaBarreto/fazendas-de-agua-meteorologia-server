import { BaseEntity } from "./BaseEntity";

export type Coordinates = {
     latitude: number,
     longitude: number,
     altitude: number,
}

/* export enum CardialPoints {
     North = "N",
     East = "E",
     South = "S",
     West = "W",
     Northeast = "NE",
     Southeast = "SE",
     Southwest = "SW",
     Northwest = "NW", 
}
 */
export interface Measurement extends BaseEntity{
     temperature: number
     airHumidity: number,
     rainVolume: number,
     windSpeed: number,
     windDirection: number, //angle 0 - 360
     coordinates: Coordinates
     station_id: string,
}