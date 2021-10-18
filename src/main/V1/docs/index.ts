import schemas from '../../../presentation/Models/Schemas'
import paths from './paths'
import * as components from './components'
export default {
  
     openapi: '3.0.0',
     info: {
     title: 'Fazenda de agua',
     description: 'Descrição do projet',
     version: '1.0.0',
     contact: {
     name: 'Lucas Fonseca Barreto',
     email: 'lucasfonsecab@hotmail.com',
     url: 'https://github.com/fonsecaBarreto'
     }
     },
     externalDocs: {
     description: 'Metereologia',
     url: ''
     },
     servers: [{
     url: '/api/v1',
          description: 'Servidor Principal'
     }],

     tags: [{
          name: 'Login',
          description: 'APIs relacionadas a login de usuarios'
     }],
     components,
     paths
}

  


