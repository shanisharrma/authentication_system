import { Account_Confirmation, Phone_Number, Role, User } from '../database';
import { Reset_Password } from '../database/models';
import { IUserWithAccountConfirmationAndResetPassword, IUserWithAssociations } from '../types';
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

    public async getUserWithAssociations(id: number) {
        const userWithAssociations: IUserWithAssociations | null = await User.findOne({
            where: { id: id },
            include: [
                { model: Role, required: true, as: 'roles' },
                { model: Phone_Number, required: true, as: 'phoneNumber' },
                { model: Account_Confirmation, required: true, as: 'accountConfirmation' },
            ],
        });
        return userWithAssociations;
    }

    public async getUserWithAccountConfirmationAndResetPasswordByEmail(email: string) {
        const userWithAccountConfirmationAndResetPassword: IUserWithAccountConfirmationAndResetPassword | null = await User.findOne({
            where: { email: email },
            include: [
                { model: Account_Confirmation, required: true, as: 'accountConfirmation' },
                { model: Reset_Password, as: 'resetPassword' },
            ],
        });
        return userWithAccountConfirmationAndResetPassword;
    }
}

export default UserRepository;
