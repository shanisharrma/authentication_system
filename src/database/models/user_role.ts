'use strict';

import { DataTypes, Model } from 'sequelize';
import connection from '../sequelize';
import { IUserRoleAttributes } from '../../types';

class User_Role extends Model<IUserRoleAttributes> implements IUserRoleAttributes {
    public id!: number;
    public userId!: number;
    public roleId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
User_Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        sequelize: connection,
        modelName: 'User_Role',
    },
);

export default User_Role;

