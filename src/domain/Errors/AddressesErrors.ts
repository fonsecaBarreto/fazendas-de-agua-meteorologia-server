

export class AddressNotFoundError extends Error {
     constructor(){
          super("Endereço nao encontrado.")
          Object.setPrototypeOf(this, AddressNotFoundError.prototype);
     }
}


export class AddressUfInvalidError extends Error {
     constructor(){
          super("UF desconhecido.")
          Object.setPrototypeOf(this, AddressUfInvalidError.prototype);
     }
}


