import { Request, Response, NextFunction } from 'express'
/* services */
import getKeys from '../../config/keys'
import LoginFactory from '../factories/login-factories'

const { authenticationServices } = LoginFactory(getKeys())

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