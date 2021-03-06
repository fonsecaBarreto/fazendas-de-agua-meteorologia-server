import { v4 } from "uuid";
import { Station } from "../../../src/domain/Entities/Station";
import faker from 'faker'

export function MakeFakeStation(params?: Partial<Station>): Station {
     return ({
          id: v4(),
          address_id: null,
          description: "Estação: " + faker.name.middleName(),
          altitude: 20,
          latitude: 55.3123,
          longitude: 33.4444,
          ...params
     })
}

