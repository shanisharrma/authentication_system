'use strict';

import { DataTypes, Model } from 'sequelize';
import connection from '../sequelize';

interface IAccountConfirmationAttributes {
    id?: number;
    userId: number;
    status: boolean;
    token: string;
    code: string;
    timestamp?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

class Account_Confirmation extends Model<IAccountConfirmationAttributes> implements IAccountConfirmationAttributes {
    public id!: number;
    public userId!: number;
    public status!: boolean;
    public token!: string;
    public code!: string;
    public timestamp?: Date | undefined;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
Account_Confirmation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize: connection,
        modelName: 'Account_Confirmation',
    },
);

export default Account_Confirmation;

