

export const ServerError = () =>{
    return { status: 500, body: "Erro no servidor."}
}

export const Ok = (body?: any) =>{
    return { status: body ? 200 : 204, body }
}

export const Download = (stream: any, headers: any) =>{
    return { status: 200, stream, headers }
}

export const Unauthorized = () =>{
    return { status: 401, body: "Acesso Negado!"  }
}

export const Forbidden = (error: Error) => {
    return { status: 403, body: error.message }
} 

export const BadRequest = (message: string) => {
    return { status: 400, body: message }
} 

export const Unprocessable = ( params: Record<string, string>, message?:string) => {
    return { status: 400, body: {
        message: message || "Preencha todos os campos corretamente!",
        params
    }  }
} 

  