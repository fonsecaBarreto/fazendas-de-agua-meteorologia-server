
export interface IEncrypter {
     sign(payload: any): Promise<string>
     verify(token: string): Promise<any>
}
