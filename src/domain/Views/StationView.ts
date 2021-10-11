import { Address } from "cluster";
import { Measurements } from "../Entities/Measurements";
import { Station } from "../Entities/Station";
import { User } from "../Entities/User";
import { UserView } from "./UserView";


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
  address: Address
  measurements?: Measurements[] 

 /*  constructor(user:User, station:Station){
    super(user)
    Object.assign(this,station)
  }

  toStation(): Station {
    const { id, address_id, altitude, latitude, longitude, description  } = this
    const station: Station = { address_id, altitude, description, id, latitude, longitude }
    return station
  } */

  
}



