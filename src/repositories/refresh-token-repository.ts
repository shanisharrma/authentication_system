import { Refresh_Token } from '../database/models';
import CrudRepository from './crud-repository';

class RefreshTokenRepository extends CrudRepository<Refresh_Token> {
    constructor() {
        super(Refresh_Token);
    }

    public async destroyByRefreshToken(token: string) {
        return await Refresh_Token.destroy({ where: { token: token } });
    }
}

export default RefreshTokenRepository;
