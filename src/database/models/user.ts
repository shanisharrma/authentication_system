'use strict';

import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import Role from './role';
import { Quicker } from '../../utils/helpers';
import { IAccountConfirmationAttributes, IPhoneNumberAttributes, IRefreshTokenAttributes, IRoleAttributes, IUserAttributes } from '../../types';

type TUserCreationAttributes = Optional<IUserAttributes, 'id'>;

class User extends Model<IUserAttributes, TUserCreationAttributes> implements IUserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public timezone!: string;
    public lastLoginAt!: Date | null;
    public consent!: boolean;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // Add Associations as optional properties
    public roles?: IRoleAttributes[] | undefined; // many-to-many association
    public phoneNumber?: IPhoneNumberAttributes | undefined; // One-to-One association
    public accountConfirmation?: IAccountConfirmationAttributes | undefined; // One-to-One association
    public refreshToken?: IRefreshTokenAttributes[] | undefined; // One-to-Many association

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
        defaultScope: {
            attributes: {
                exclude: ['password'],
            },
        },
        scopes: {
            withPassword: {
                attributes: {
                    exclude: [''],
                },
            },
        },
    },
);

User.beforeCreate(async (user: User) => {
    user.password = await Quicker.hashPassword(user.password);
});

export default User;

