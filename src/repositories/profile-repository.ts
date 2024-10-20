import { Profile, User } from '../database/models';
import { IProfileAttributes, TProfileWithUserAssociations } from '../types';
import CrudRepository from './crud-repository';

class ProfileRepository extends CrudRepository<Profile> {
    constructor() {
        super(Profile);
    }

    public async getWithAssociationsByUserId(id: number): Promise<TProfileWithUserAssociations | null> {
        const response: TProfileWithUserAssociations | null = await this.getOne({
            where: { userId: id },
            include: [{ model: User, required: true, as: 'user' }],
        });
        return response;
    }

    public async getByUserId(userId: number): Promise<IProfileAttributes | null> {
        return await this.getOne({ where: { userId: userId } });
    }
}

export default ProfileRepository;
