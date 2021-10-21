import { Address } from '../../Entities/Address';
import { AddressView } from '../../Views/AddressView';
import { AddressLabelView } from '../../Views/StationView';
import { IBaseRepository } from './IBaseRepository'

export interface IAddressRepository extends IBaseRepository<Address>{
     relateUser(user_id:string, address_id:string ): Promise<boolean>
     findAddress(id:string): Promise<AddressView>
/*      listAddresses(): Promise<AddressLabelView[]> */
}