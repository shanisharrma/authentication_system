'use strict';

import { DataTypes, Model } from 'sequelize';
import connection from '../sequelize';
import { EUserRole } from '../../utils/constants/Enums';

const { ADMIN, MODERATOR, USER } = EUserRole;

interface IRoleAttributes {
    id?: number;
    role: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

class Role extends Model<IRoleAttributes> implements IRoleAttributes {
    public id!: number;
    public role!: string;
    public description!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
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

