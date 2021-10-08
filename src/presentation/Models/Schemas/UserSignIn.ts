import { ObjectValidator } from '../../../domain/Interfaces/ObjectValidator'

export interface UserSignInView {
     username: string,
     password: string
}

export const UserSignInSchema: ObjectValidator.Schema= {
     "username": { "type": "string", "label": "Nome de Usuario" },
     "password": { "type": "string", "label": "Senha" }
}