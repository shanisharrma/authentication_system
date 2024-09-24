'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { EUserRole } from '../../utils/constants/Enums';
import { IRoleAttributes, IUserAttributes } from '../../types';

const { ADMIN, MODERATOR, USER } = EUserRole;

type TRoleCreationAttributes = Optional<IRoleAttributes, 'id'>;

class Role extends Model<IRoleAttributes, TRoleCreationAttributes> implements IRoleAttributes {
    public id!: number;
    public role!: string;
    public description!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // Adding association as optional properties
    public users?: IUserAttributes[] | undefined; // many-to-many association
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        role: {
            type: DataTypes.ENUM,
            values: [ADMIN, USER, MODERATOR],
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'Role',
    },
);

export default Role;

