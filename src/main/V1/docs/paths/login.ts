export const loginPath = {
     post: {
       tags: ['Login'],
       summary: 'API para autenticar usuário',
       description: 'Essa rota pode ser executada por **qualquer usuário**',
       requestBody: {
         required: true,
         content: {
           'application/json': {
             schema: {
             
             }
           }
         }
       },
       responses: {
         200: {
           description: 'Sucesso',
           content: {
             'application/json': {
               schema: {
               
               }
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

