'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IAccountConfirmationAttributes, IUserAttributes } from '../../types';

type TAccountConfirmationCreationAttributes = Optional<IAccountConfirmationAttributes, 'id'>;

class Account_Confirmation
    extends Model<IAccountConfirmationAttributes, TAccountConfirmationCreationAttributes>
    implements IAccountConfirmationAttributes
{
    public id!: number;
    public userId!: number;
    public status!: boolean;
    public token!: string;
    public code!: string;
    public timestamp?: Date | undefined;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // Adding associations as optional properties
    public user?: IUserAttributes | undefined; /// One-to-One association
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

