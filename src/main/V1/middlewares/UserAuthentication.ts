import { Request, Response, NextFunction } from 'express'
/* services */
import { authenticationServices } from '../factories/login-factories'


export async function AuthenticateUserMiddleware (request:Request, response: Response, next: NextFunction) {

    const { headers, query } = request 

    var token: string | null = headers.authorization ? headers.authorization.split(' ')[1] : null

    if(!token) {
        token = query.a ? query.a + "" : null
    }

    if(token) {
        const user = await authenticationServices.verifyToken(token)   
        if (user) { request.user= user } 
    }

    return next()
}