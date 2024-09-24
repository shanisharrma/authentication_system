'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IPhoneNumberAttributes, IUserAttributes } from '../../types';

type TPhoneNumberCreationAttributes = Optional<IPhoneNumberAttributes, 'id'>;

class Phone_Number extends Model<IPhoneNumberAttributes, TPhoneNumberCreationAttributes> implements IPhoneNumberAttributes {
    public id!: number;
    public userId!: number;
    public isoCode!: string;
    public countryCode!: string;
    public internationalNumber!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // Adding associations as optional properties
    public user?: IUserAttributes | undefined; /// One-to-One association
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

