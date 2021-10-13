/* export * from './AddressSchemas'
export * from './LoginSchema'
export * from './StationsSchemas'
export * from './UsersSchemas'
 */

/* export { CreateUser_BodySchema } from './UsersSchemas'
 */

const qualquer = {

          type: 'object',
          properties: {
               accessToken: {
                    type: 'string'
               },
               name: {
                    type: 'string'
               }
          },
          required: ['accessToken', 'name']

}
export default {
     account: qualquer,
}