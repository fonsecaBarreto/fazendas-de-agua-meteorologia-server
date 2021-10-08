import { BaseEntity } from "./BaseEntity";

export interface Address extends BaseEntity{
     street:string
     region:string
     uf: string
     number:string
     city: string
     details: string
     postalCode: string
}