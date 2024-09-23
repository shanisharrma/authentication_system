'use strict';

import { DataTypes, Model } from 'sequelize';
import connection from '../sequelize';

interface IPhoneNumberAttributes {
    id?: number;
    userId: number;
    isoCode: string;
    countryCode: string;
    internationalNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

class Phone_Number extends Model<IPhoneNumberAttributes> implements IPhoneNumberAttributes {
    public id!: number;
    public userId!: number;
    public isoCode!: string;
    public countryCode!: string;
    public internationalNumber!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
Phone_Number.init(
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
        isoCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        internationalNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'Phone_Number',
    },
);

export default Phone_Number;

