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

    public async findOneByEmailWithPassword(email: string): Promise<User | null> {
        const user = await User.scope('withPassword').findOne({ where: { email: email } });
        return user;
    }

    public async getUserWithPasswordById(id: number) {
        const user = User.scope('withPassword').findByPk(id);
        return user;
    }
}

export default UserRepository;
