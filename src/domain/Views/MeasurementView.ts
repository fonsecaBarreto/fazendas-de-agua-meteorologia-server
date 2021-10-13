
import { Measurements, Coordinates } from "../Entities/Measurements";

export class MeasurementView implements Measurements{

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

  
     constructor(params: Measurements){
          Object.assign(this,{ ...params })
     }
     
}

