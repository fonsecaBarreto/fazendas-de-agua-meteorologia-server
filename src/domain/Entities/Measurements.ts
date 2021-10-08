import { Address } from "./Address";
import { BaseEntity } from "./BaseEntity";

export interface Measurements extends BaseEntity{
     temperature: number
     airHumidity: number,
     rainVolume: number,
     windSpeed: number,
     windDirection: number,
     station_id: string,
}