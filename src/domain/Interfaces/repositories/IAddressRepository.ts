import { Address } from '../../Entities/Address';
import { IBaseRepository } from './IBaseRepository'

export interface IAddressRepository extends IBaseRepository<Address>{
     relateUser(user_id:string, address_id:string ): Promise<boolean>
}