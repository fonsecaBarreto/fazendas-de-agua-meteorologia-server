
import { Measurement, Coordinates } from "../Entities/Measurements";

export class MeasurementView implements Measurement{

     temperature: number;
     airHumidity: number;
     rainVolume: number;
     windSpeed: number;
     windDirection: number;
     coordinates: Coordinates;
     station_id: string;

     id: string;
     created_at?: Date;
     updated_at?: Date;

  
     constructor(params: Measurement){
          Object.assign(this,{ ...params })
     }
     
}

