import { Express, response } from 'express'

import { setupApp, closeApp } from '../../src/main/config/app'
import getKeys, { ENV_VARIABLES } from '../../src/main/config/keys'

import KnexAdapter from '../../src/infra/db/KnexAdapter'

import { MakeFakeUser } from '../mocks/entities/MakeUser'
import { User, UsersRole } from '../../src/domain/Entities/User'
/* Libs */
import { hashSync } from 'bcrypt'
import { MakeFakeAddress } from '../mocks/entities/MakeAddress'
import { Address } from '../../src/domain/Entities/Address'
import jwt from 'jsonwebtoken'

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
          MakeFakeUser({ name: 'Seu Zé' ,username: 'basic_user_test', role: UsersRole.Basic }),
     ];

     const test_addresses = [
          MakeFakeAddress({ city: "Rio das Ostras"})
     ]

     keys = getKeys()
     app = await setupApp(keys)
     await KnexAdapter.open('test')
     await KnexAdapter.resetMigrations()
     await KnexAdapter.connection('users').insert(test_users)
     await KnexAdapter.connection('addresses').insert(test_addresses)

     const admin_token = await jwt.sign({ id: test_users[0].id}, keys.JWT_SECRET)
     const basic_token = await jwt.sign({ id: test_users[1].id}, keys.JWT_SECRET)

     return ({ app, keys, test_users, test_addresses, tokens: { admin_token, basic_token} })

}

export const CloseEnv = async () =>{
     await closeApp()
}

export default MakeTestEnv