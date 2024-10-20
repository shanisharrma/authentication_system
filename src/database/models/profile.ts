'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IProfileAttributes, IUserAttributes } from '../../types';

type TProfileCreationAttributes = Optional<IProfileAttributes, 'id'>;

class Profile extends Model<IProfileAttributes, TProfileCreationAttributes> implements IProfileAttributes {
    public id!: number;
    public userId!: number;
    public gender!: string;
    public dateOfBirth!: string;
    public about!: string;
    public imageUrl!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    public user?: IUserAttributes | undefined;
}
Profile.init(
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
        gender: {
            type: DataTypes.STRING,
        },
        dateOfBirth: {
            type: DataTypes.STRING,
        },
        about: {
            type: DataTypes.STRING,
        },
        imageUrl: {
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
        modelName: 'Profile',
    },
);

export default Profile;

