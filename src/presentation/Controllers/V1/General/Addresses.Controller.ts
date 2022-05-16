import { IAddressesServices } from "../../../../domain/Services/Addresses/Addresses_Services";
import { AccessType, BadRequest, BaseController, Ok } from "../../../Protocols/BaseController";
import { Forbidden, NotFound, Request, Response } from "../../../Protocols/Http";
import { Address_Http_Dtos } from '../../../Models/Schemas/AddressSchemas'
import { AddressNotFoundError, AddressUfInvalidError } from "../../../../domain/Errors/AddressesErrors";
import { AddressView } from "../../../../domain/Views/AddressView";
import { Address } from "../../../../domain/Entities/Address";
import { IPermissionsServices } from "../../../../domain/Services/Users/Permision_Services";
import { UserNotAllowedError } from "../../../../domain/Errors";

//POST /addresses
export class CreateAddressController extends BaseController {
     constructor(
          private readonly addressesServices: Pick<IAddressesServices, 'create'>
     ){ super( AccessType.ADMIN, { body: Address_Http_Dtos.Create_Address_Schema })}

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

//PUT /addresses/:id
export class UpdateAddressController extends BaseController {
     constructor(
          private readonly addressesServices: Pick<IAddressesServices, 'update'>
     ){ super(AccessType.ADMIN, { 
          body: Address_Http_Dtos.Create_Address_Schema,
          params: Address_Http_Dtos.Address_Params_Schema
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

// GET /addresses
export class ListAddressController extends BaseController {
     constructor(
          private readonly addressesServices: Pick<IAddressesServices, 'list'>
     ){ super(AccessType.PUBLIC)}

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


// GET /addresses/:id
export class FindAddresController extends BaseController {
     constructor(
          private readonly _permissionService: Pick<IPermissionsServices, 'isUserRelatedToAddress'>, 
          private readonly addressesServices: Pick<IAddressesServices, 'find' >,

     ){ super(AccessType.PUBLIC, { 
          params: Address_Http_Dtos.Address_Params_Schema
     })}

     async handler(request: Request): Promise<Response> {

          const { user,query, params } = request;

          const viewMode = query.v;
          const { id: address_id } = params;

          /* const isAllowed = await this._permissionService.isUserRelatedToAddress({ user, address_id }) 
          if(!isAllowed) return Forbidden(new UserNotAllowedError()) */

          const address: AddressView = await this.addressesServices.find(address_id)
          if(!address) return Ok(null);

          if(viewMode === "labelview") return Ok((address.getLabelView()))
          
          return Ok(address)
       
     }
}

// DELETE /addresses/:id
export class RemoveAddresController extends BaseController {
     constructor(
          private readonly addressesServices: IAddressesServices

     ){ super(AccessType.ADMIN, { 
          params: Address_Http_Dtos.Address_Params_Schema
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
