import { IAddressesServices } from "../../../../domain/Services/Addresses/Addresses_Services";
import { AccessType, BadRequest, BaseController, Ok } from "../../../Protocols/BaseController";
import { NotFound, Request, Response, Unauthorized } from "../../../Protocols/Http";
import { Address_BodySchema, Address_ParamsSchema, Address_RemoveParamsSchema } from '../../../Models/Schemas/AddressSchemas'
import { AddressNotFoundError, AddressUfInvalidError } from "../../../../domain/Errors/AddressesErrors";
import { address } from "faker";
import { AddressView } from "../../../../domain/Views/AddressView";
import { serialize } from "v8";
import { Address } from "../../../../domain/Entities/Address";
import { UsersRole } from "../../../../domain/Entities/User";
import { UserView } from "../../../../domain/Views/UserView";
import { hostname } from "os";
import { IAddressRepository } from "../../../../domain/Interfaces";

export class CreateAddressController extends BaseController {
     constructor(
          private readonly addressesServices: Pick<IAddressesServices, 'create'>
     ){ super( AccessType.ADMIN, { body: Address_BodySchema })}

     async handler(request: Request): Promise<Response> {

          const { city, details, uf, street, region, postalCode, number } = request.body;

          try{
               const address = await this.addressesServices.create({ city, details, uf, street, region, postalCode, number });
               return Ok(address);
          }catch(err){
               if(err instanceof AddressUfInvalidError ) 
                    return BadRequest(err.message);
               throw err               
          }
     }
}

export class UpdateAddressController extends BaseController {
     constructor(
          private readonly addressesServices: Pick<IAddressesServices, 'update'>
     ){ super(AccessType.ADMIN, { 
          body: Address_BodySchema,
          params: Address_ParamsSchema
     } )}

     async handler(request: Request): Promise<Response> {
          const id = request.params.id;

          const { city, details, uf, street, region, postalCode, number } = request.body;

          try{
               const address = await this.addressesServices.update( id, { city, details, uf, street, region, postalCode, number });
               return Ok(address);
          }catch(err){
               if(err instanceof AddressNotFoundError ) {
                    return NotFound(err.message);
               }

               if(err instanceof AddressUfInvalidError ) {
                    return BadRequest(err.message);
               }
               throw err               
          }
     }
}

export class ListAddressController extends BaseController {
     constructor(
          private readonly addressesServices: Pick<IAddressesServices, 'list'>
     ){ super(AccessType.ADMIN)}

     async handler(request: Request): Promise<Response> {

          const viewMode = request.query.v

          const addresses: Address[] = await this.addressesServices.list();

          if(viewMode === "labelview"){ 
               const serialized = await Promise.all( addresses.map(a=>(new AddressView(a).getLabelView())) )
               return Ok(serialized)
          }

          return Ok(addresses)
     }
}

export class FindAddresController extends BaseController {
     constructor(
          private readonly addressesServices: Pick<IAddressesServices, 'find' >,
          private readonly addressRepository: Pick<IAddressRepository, 'isUserRelated'>

     ){ super(AccessType.ANY_USER, { 
          params: Address_ParamsSchema
     })}

     async handler(request: Request): Promise<Response> {

          const { user,query, params } = request;

          const viewMode = query.v;
          const id = params.id;

          if(user.role !== UsersRole.Admin){
               if( !user.address || ! user.address.id) return Unauthorized();
               const isRelated =await this.addressRepository.isUserRelated(user.id, id)
               if(isRelated === false) return Unauthorized()
          }

          const address: AddressView = await this.addressesServices.find(id)
          if(!address) return Ok(null);

          if(viewMode === "labelview") return Ok((address.getLabelView()))
          return Ok(address)
       
     }
}

export class RemoveAddresController extends BaseController {
     constructor(
          private readonly addressesServices: IAddressesServices

     ){ super(AccessType.ADMIN, { 
          params: Address_RemoveParamsSchema
     })}

     async handler(request: Request): Promise<Response> {

          const id = request.params.id;
          try{
               await this.addressesServices.remove(id) 
               return Ok()

          }catch(err){
               if(err instanceof AddressNotFoundError){
                    return NotFound(err)
               }
               throw err
          }
     }
} 
