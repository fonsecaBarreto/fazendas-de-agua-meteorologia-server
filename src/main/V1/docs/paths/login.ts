import { SignIn_BodySchema } from '../../../../presentation/Models/Schemas/LoginSchema'
export const signInPath = {
  post: {
    tags: ['Login'],
    summary: 'API para Gerar token de autentificação',
    description: 'Essa rota pode ser executada por qualquer usuario',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            ...SignIn_BodySchema
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {  }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}

