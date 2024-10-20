import { Account_Confirmation, Phone_Number, Role, User } from '../database';
import { Profile, Reset_Password } from '../database/models';
import { TUserWithAccountConfirmationAndResetPassword, TUserWithAssociations, TUserWithProfileAssociations } from '../types';
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
        const userWithAssociations: TUserWithAssociations | null = await User.findOne({
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
        const userWithAccountConfirmationAndResetPassword: TUserWithAccountConfirmationAndResetPassword | null = await User.findOne({
            where: { email: email },
            include: [
                { model: Account_Confirmation, required: true, as: 'accountConfirmation' },
                { model: Reset_Password, as: 'resetPassword' },
            ],
        });
        return userWithAccountConfirmationAndResetPassword;
    }

    public async getWithAssociationsById(id: number): Promise<TUserWithAssociations | null> {
        const response: TUserWithAssociations | null = await this.getOne({
            where: { id: id },
            include: [
                { model: Role, required: true, as: 'roles' },
                { model: Profile, required: true, as: 'profileDetails' },
                { model: Phone_Number, required: true, as: 'phoneNumber' },
                { model: Account_Confirmation, as: 'accountConfirmation' },
                { model: Profile, as: 'profileDetails' },
            ],
        });
        return response;
    }

    public async getWithProfileById(id: number) {
        const response: TUserWithProfileAssociations | null = await this.getOne({
            where: { id },
            include: [
                {
                    model: Profile,
                    required: true,
                    as: 'profileDetails',
                },
            ],
        });
        return response;
    }
}

export default UserRepository;
