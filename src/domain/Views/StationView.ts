
import { threadId } from "worker_threads";
import { Address } from "../Entities/Address";
import { Measurement, Coordinates } from "../Entities/Measurements";
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
  address?: Address
  measurements?: Measurement[] 

  constructor(station:Station, address: Address= null,  ms: Measurement[] = []){
    Object.assign(this,station)
    this.address = address;
    this.measurements = ms;
  }

  getCoordinates():Coordinates{
    const { latitude, altitude, longitude  } = this
    return ({ latitude, altitude, longitude })
  }

  
}



