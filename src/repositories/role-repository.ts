import { Role } from '../database';
import CrudRepository from './crud-repository';

class RoleRepository extends CrudRepository<Role> {
    constructor() {
        super(Role);
    }

    public async findByRole(userRole: string) {
        const role = Role.findOne({ where: { role: userRole } });
        return role;
    }
}

export default RoleRepository;
