
import { Measurement, Coordinates, CardialPoints } from "../Entities/Measurements";

export class MeasurementView implements Measurement{

     id: string;
     station_id: string;
     coordinates: Coordinates;

     created_at: Date;
     temperature: number;
     airHumidity: number;
     windSpeed: number;
     windDirection: CardialPoints

     rainVolume: number;
     AccRainVolume: number
  
     constructor(params: Measurement){
          Object.assign(this,{ ...params })
     }
     
}

