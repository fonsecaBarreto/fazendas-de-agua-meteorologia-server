
import { name } from 'faker'
import { sign, verify, JsonWebTokenError  } from 'jsonwebtoken'
import { IEncrypter } from '../domain/Interfaces/IEncrypter'



export class JsonWebTokenAdapter implements IEncrypter {
    constructor(
        private readonly secret:string
    ){}

    async sign(payload: any): Promise<string> {
        try{
            const token = await sign({ ...payload }, this.secret)
            return token
        } catch(err: any ){
            return null
        }
    }

    async verify(token: string): Promise<any> {
        var decoded = await verify(token, this.secret)
        return decoded
    }
}

