
import { Address } from "../Entities/Address";
import { Station } from "../Entities/Station";


export interface AddressLabelView {
  label: string,
  value: string
}

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

  getLabelView(): AddressLabelView{
    return (
      { 
        value: this.id,
        label: `${this.street}, ${this.number}; ${this.region}, ${this.city} - ${this.uf} (${this.postalCode})`
      })
  } 
}

