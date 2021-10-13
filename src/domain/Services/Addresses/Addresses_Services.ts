
import { Address } from "../../Entities/Address";
import { AddressNotFoundError, AddressUfInvalidError } from "../../Errors/AddressesErrors";
import { UserNotAllowedError, UserNotFoundError } from "../../Errors/UsersErrors";
import { IIdGenerator, IUserRepository } from "../../Interfaces";
import { IAddressRepository } from "../../Interfaces/repositories/IAddressRepository";
import { AddressView } from "../../Views/AddressView";
import { UserView } from "../../Views/UserView";
import ufs from './ufs.json'

const ufs_prefixs = Object.values(ufs);

export namespace IAddressesServices {

     export namespace Params {
          export type Create = Omit<Address, 'id' | 'created_at' | 'updated_at'>
          export type AppendUser = { user: UserView, address: Address }
     }
     
}

export interface IAddressesServices {
     create(params: IAddressesServices.Params.Create): Promise<AddressView>
     update(id:string, address:  IAddressesServices.Params.Create): Promise<AddressView> 
     find(id:string): Promise<AddressView>
     list(): Promise<Address[]>
     remove(id:string): Promise<void>
     appendUserToAddress(params: IAddressesServices.Params.AppendUser): Promise<void>
}

export class AddressesServices implements IAddressesServices {
     constructor(
          private readonly _addressRepository: IAddressRepository,
          private readonly _idGenerator: IIdGenerator
     ){}

     private async createOrUpdate(params: IAddressesServices.Params.Create, id?:string): Promise<AddressView>{

          if(id) {
               const addressExists = await this._addressRepository.find(id);
               if(!addressExists) 
                    throw new AddressNotFoundError();
          }
          const uf = params.uf.toUpperCase()
          
          if(!ufs_prefixs.includes(uf))  throw new AddressUfInvalidError(); 
          
          const address: Address = { ...params, uf, id: id ? id : this._idGenerator.gen() }
          
          await this._addressRepository.upsert(address);

          return new AddressView(address)

     }

     /* Interfaces publicas */
 
     public async create(params: IAddressesServices.Params.Create): Promise<AddressView> {
          return await this.createOrUpdate(params)
     }

     public async update(id:string, address: IAddressesServices.Params.Create): Promise<AddressView> {
          return await this.createOrUpdate(address, id)
     }

     public async find(id:string): Promise<AddressView>{
          const address: AddressView = await this._addressRepository.findAddress(id)
          return address;
     }

     public async list(): Promise<Address[]>{
          const addresses: Address[] = await this._addressRepository.list()
          return addresses.length > 0 ? addresses : [];
     }
     public async remove(id:string): Promise<void>{
          const wasDeleted = await this._addressRepository.remove(id)
          if(!wasDeleted) throw new AddressNotFoundError()
     }

     public async appendUserToAddress(params: IAddressesServices.Params.AppendUser): Promise<void>{

          const { user, address } = params

          const done = await this._addressRepository.relateUser(user.id, address.id);
          if(!done) throw new UserNotAllowedError()

          user.setAddress(address)
          return null
     }

}