'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IResetPasswordAttributes, IUserAttributes } from '../../types';

type IResetPasswordCreationAttributes = Optional<IResetPasswordAttributes, 'id'>;

class Reset_Password extends Model<IResetPasswordCreationAttributes, IResetPasswordAttributes> implements IResetPasswordAttributes {
    public id!: number;
    public userId!: number;
    public token!: string;
    public expiresAt!: number;
    public used!: boolean;
    public lastResetAt?: Date | undefined;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // Adding associations as optional properties
    public user?: IUserAttributes | undefined;
}
Reset_Password.init(
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
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        lastResetAt: {
            type: DataTypes.DATE,
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'Reset_Password',
    },
);

export default Reset_Password;

