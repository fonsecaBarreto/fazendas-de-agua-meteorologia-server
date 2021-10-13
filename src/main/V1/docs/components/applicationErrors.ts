export const applicationError = {
     type: "object",
     properties: { error: { type: 'string' }, },
     required: ['error']
}

export const badRequest = {
     description: 'Requisição inválida.',
     content: {
          'application/json': {
               schema: applicationError
          }
     }
}

export const serverError = {
     description: 'Erro no servidor.',
     content: {
          'application/json': {
               schema: applicationError
          }
     }
}

export const forbidden = {
     description: 'Ação Negada.',
     content: {
          'application/json': {
               schema: applicationError
          }
     }
}

export const Unauthorized = {
     description: 'Acesso negado.',
     content: {
          'application/json': {
               schema: applicationError
          }
     }
}