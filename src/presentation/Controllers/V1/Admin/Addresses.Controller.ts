import { IAddressesServices } from "../../../../domain/Services/Addresses/Addresses_Services";
import { AccessType, BadRequest, BaseController, Ok } from "../../../Protocols/BaseController";
import { NotFound, Request, Response } from "../../../Protocols/Http";
import { Address_BodySchema, Address_ParamsSchema, Address_RemoveParamsSchema } from '../../../Models/Schemas/AddressSchemas'
import { AddressNotFoundError, AddressUfInvalidError } from "../../../../domain/Errors/AddressesErrors";

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

export class FindAddresController extends BaseController {
     constructor(
          private readonly addressesServices: Pick<IAddressesServices, 'find' | 'list'>

     ){ super(AccessType.ADMIN, { 
          params: Address_ParamsSchema
     })}

     async handler(request: Request): Promise<Response> {

          const id = request.params.id;

          if(id){
               const user= await this.addressesServices.find(id)
               return Ok(user)
          }

          const users = await this.addressesServices.list();
          return Ok(users)

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
