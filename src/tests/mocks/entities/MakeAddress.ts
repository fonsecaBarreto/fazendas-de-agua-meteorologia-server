import { v4 } from "uuid";
import { Address } from "../../../domain/Entities/Address";
import faker from 'faker'

export function MakeFakeAddress(params?: Partial<Address>): Address {
     return ({
          id: v4(),
          city: faker.address.cityName(),
          details: faker.address.direction(),
          number: '456 - A',
          postalCode: faker.address.zipCode("00000000"),
          region: "Liberdade",
          street: faker.address.streetAddress(),
          uf: 'RJ',
          ...params
     })
}