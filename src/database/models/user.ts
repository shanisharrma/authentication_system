'use strict';

import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, DataTypes, Model } from 'sequelize';
import connection from '../sequelize';
import Role from './role';
import { Quicker } from '../../utils/helpers';

interface IUserAttributes {
    id?: number;
    name: string;
    email: string;
    password: string;
    timezone: string;
    lastLoginAt?: Date | null;
    consent: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

class User extends Model<IUserAttributes> implements IUserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public timezone!: string;
    public lastLoginAt!: Date | null;
    public consent!: boolean;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    declare addRole: BelongsToManyAddAssociationMixin<Role, Role['id']>;
    declare addRoles: BelongsToManyAddAssociationsMixin<Role, Role['id']>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 72],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        consent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
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
        modelName: 'User',
    },
);

User.beforeCreate(async (user: User) => {
    user.password = await Quicker.hashPassword(user.password);
});

export default User;

