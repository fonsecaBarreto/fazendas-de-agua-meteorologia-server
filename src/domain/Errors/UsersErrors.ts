export class UserRoleIsInvalidError extends Error {
     constructor(){
          super("Tipo de usuário desconhecido")
          Object.setPrototypeOf(this, UserRoleIsInvalidError.prototype);
     } 
}

export class UserNotFoundError extends Error {
     constructor(){
          super("Usuario nao encontrado.")
          Object.setPrototypeOf(this, UserNotFoundError.prototype);
     }
}

export class UserNameInUseError extends Error {
     constructor(){
          super(`Já existe um usuario para esse Nome de Usuario`)
          Object.setPrototypeOf(this, UserNameInUseError.prototype);
     }
}


export class UserNotAllowedError extends Error {
     constructor(){
          super("Operação negada.")
          Object.setPrototypeOf(this, UserNotAllowedError.prototype);
     }
}