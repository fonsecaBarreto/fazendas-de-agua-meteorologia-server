/* import { Router } from 'express'
import swaggerUI from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import jsonDocumentation from './index'
export default (router: Router) => {
     const specs = swaggerJsDoc(jsonDocumentation) 
     router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(jsonDocumentation))
} */