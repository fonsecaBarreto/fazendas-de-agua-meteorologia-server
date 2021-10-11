import { User } from "../../domain/Entities/User"
export * from './http-helper'
export type Request = {
    params: any,
    query: any,
    headers: any
    body?:any,
    user?: User,
    files?: any
}

export type Response = {
    status: number,
    body?:any,
    headers?: object
}
