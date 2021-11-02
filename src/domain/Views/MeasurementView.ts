
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
     accRainVolume: number
  
     constructor(params: Measurement){
          Object.assign(this,{ ...params })
     }
     
}

/* Media dos valores e tal */


export interface MeasurementMetrics {

     start_limit: Date
     end_limit: Date
     amount: number // number measurements calculated

     mTemperature: number;
     mAirHumidity: number;
     mWindSpeed: number;
     mdWindDirection: CardialPoints
     mRainVolume: number;
     mAccRainVolume: number


}