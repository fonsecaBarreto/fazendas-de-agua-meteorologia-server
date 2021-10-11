import { IEncrypter } from "../../../domain/Interfaces"

export class EncrypterStub implements IEncrypter {
     async sign(payload: any): Promise<string> {
          return "generated_access_token"
     }
     async verify(token: string): Promise<any> {
          return { id: "usuario_id" }
     }
}