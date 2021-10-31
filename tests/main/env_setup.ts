import { Express, response } from 'express'
import { setupApp, closeApp } from '@/main/config/app'
import getKeys, { ENV_VARIABLES } from '@/main/config/keys'
import KnexAdapter from '@/infra/db/KnexAdapter'
import { User, UsersRole, Address } from '@/domain/Entities'

/* Libs */
import { hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
/* stubs */
import { MakeFakeUser, MakeFakeAddress } from '@/tests/mocks/entities'

export type MainTestEnv = {
     app: Express; keys: 
     ENV_VARIABLES; 
     test_users : User[];
     test_addresses: Address[];
     tokens: Record<string, string>
}

export const MakeTestEnv = async (): Promise<MainTestEnv> =>{

     var app: Express
     var keys: ENV_VARIABLES

     const test_users = [
          MakeFakeUser({ name: "Usuario administrador", username:"admin_test", password: hashSync("12345678",12), role: UsersRole.Admin }),
          MakeFakeUser({ name: 'Seu Zé Com endereço' ,username: 'basic_user_ze_test', role: UsersRole.Basic }),
          MakeFakeUser({ name: 'Seu Antonio sem Endereço' ,username: 'basic_user_antonio_test', role: UsersRole.Basic }),
     ];

     const test_addresses = [
          MakeFakeAddress({ city: "Rio das Ostras"})
     ]

     keys = getKeys()
     app = await setupApp(keys)
     await KnexAdapter.open('test')
     await KnexAdapter.resetMigrations()
     await KnexAdapter.connection('addresses').insert(test_addresses)
     await KnexAdapter.connection('users').insert(test_users)

     const admin_token = await jwt.sign({ id: test_users[0].id}, keys.JWT_SECRET)
     const basic_token = await jwt.sign({ id: test_users[1].id}, keys.JWT_SECRET)
     const basic_token_noaddress = await jwt.sign({ id: test_users[2].id}, keys.JWT_SECRET)

     return ({ app, keys, test_users, test_addresses, tokens: { admin_token, basic_token, basic_token_noaddress} })

}

export const CloseEnv = async () =>{
     await closeApp()
}

export default MakeTestEnv