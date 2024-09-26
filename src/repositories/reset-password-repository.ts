import { Reset_Password, User } from '../database/models';
import { TResetPasswordWithUser } from '../types';
import CrudRepository from './crud-repository';

class ResetPasswordRepository extends CrudRepository<Reset_Password> {
    constructor() {
        super(Reset_Password);
    }

    public async getResetPasswordWithUserByToken(token: string) {
        const resetPasswordWithUser: TResetPasswordWithUser | null = await Reset_Password.findOne({
            where: { token: token },
            include: [{ model: User, required: true, as: 'user' }],
        });
        return resetPasswordWithUser;
    }
}

export default ResetPasswordRepository;
