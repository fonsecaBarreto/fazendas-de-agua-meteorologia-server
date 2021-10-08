export class UsersErrors extends Error {
     constructor(msg:string){
          super(msg)
     }
}

export class UserRoleIsInvalidError extends UsersErrors {
     constructor(){
          super("Tipo de usuário Desconhecido")
     }
}

export class UserNotFoundError extends UsersErrors {
     constructor(){
          super("Usuario nao encontrado.")
     }
}

export class UserInUseError extends UsersErrors {
     constructor(){
          super(`Já existe um usuario para esse E-mail ou numero de telefone`)
     }
}