import { StatOptions } from "fs";
import { Address } from "../Entities/Address";
import { Station } from "../Entities/Station";
import { User, UsersRole } from "../Entities/User";

export class AddressView implements Address{

  id: string;
  created_at?: Date;
  updated_at?: Date;

  street: string;
  region: string;
  uf: string;
  number: string;
  city: string;
  details: string;
  postalCode: string;

  stations: Station[];
  
  constructor(params: Address, stas: Station[] = []){
    Object.assign(this,{ ...params })
    this.stations = stas
  }

  setAddress(stas: Station[]){
    this.stations = stas
  }
}

