import { UserView } from "../../domain/Views/UserView"
export * from './http-helper'

export type Request = {
    params: any,
    query: any,
    headers: any
    body?:any,
    user?: UserView,
    files?: any
}

export type Response = {
    status: number,
    body?:any,
    headers?: object
}
