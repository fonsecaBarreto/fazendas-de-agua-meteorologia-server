
import { Measurements } from "../Entities/Measurements";
import { Station } from "../Entities/Station";


export class StationView implements Station {

  id: string;
  created_at?: Date;
  updated_at?: Date;

  description: string;
  longitude: number;
  latitude: number;
  altitude: number;
  address_id: string;

  //Relactions
  measurements?: Measurements[] 

  constructor(station:Station, ms: Measurements[] = []){
    Object.assign(this,station)
    this.measurements = ms;
  }
  
}



