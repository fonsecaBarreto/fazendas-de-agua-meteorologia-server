import { Address } from "./Address";
import { BaseEntity } from "./BaseEntity";
import { Measurements } from "./Measurements";

export interface Station extends BaseEntity {
     id: string,
     description: string,
     longitude: number,
     latitude: number,
     altitude: number,
     address_id:string,
     //relations
     address?: Address
     measurements?: Measurements[]
}
