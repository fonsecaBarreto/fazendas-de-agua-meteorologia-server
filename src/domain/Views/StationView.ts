
import { Address } from "../Entities/Address";
import { Measurement } from "../Entities/Measurements";
import { Station } from "../Entities/Station";

export interface SMTimeIntervalFeed{
  total: number,
  start_date: Date,
  end_date: Date,
  data: Measurement[]
}

export interface SMPageFeed {
  total: number, // Total de Medições Existentes para essa Estação
  page_index: number // Indice da pagina 
  page_limit: number // Length de um uma pagina (limit)
  data: Measurement[] // Medições 
}

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
  measurements?: SMPageFeed | SMTimeIntervalFeed

  constructor(station:Station, address: Address= null){
    Object.assign(this,station)
    this.address = address;
    this.measurements = null;
  }

  setMeasurements(mm: SMPageFeed | SMTimeIntervalFeed){
    this.measurements = mm
  }

  getCoordinates():number[]{
    const { latitude, altitude, longitude  } = this
    return ([latitude, altitude, longitude])
  }

  
}