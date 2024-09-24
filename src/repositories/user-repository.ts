import { FindOptions } from 'sequelize';
import { User } from '../database';
import CrudRepository from './crud-repository';

class UserRepository extends CrudRepository<User> {
    constructor() {
        super(User);
    }

    public async findOneByEmail(email: string): Promise<User | null> {
        const user = await User.findOne({ where: { email: email } });
        return user;
    }

    public async getUserWithPassword(id: number) {
        const user = User.scope('withPassword').findByPk(id);
        return user;
    }

    public async getAllUsersWithPassword(options?: FindOptions) {
        const users = await User.scope('withPassword').findAll(options);
        return users;
    }
}

export default UserRepository;
