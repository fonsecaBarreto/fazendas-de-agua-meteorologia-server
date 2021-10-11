import { Station } from '../../Entities/Station';
import { User } from '../../Entities/User';
import { UserView } from '../../Views/UserView';
import { IBaseRepository } from './IBaseRepository'

export interface IUserRepository extends IBaseRepository<User> {
     findByUsername(username:string): Promise<User>
     findUser(id:string): Promise<UserView>

}