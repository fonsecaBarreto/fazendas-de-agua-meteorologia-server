import { BaseEntity } from "./BaseEntity";

export interface Station extends BaseEntity {
     id: string,
     description: string,
     longitude: number,
     latitude: number,
     altitude: number,
     address_id:string,
}
