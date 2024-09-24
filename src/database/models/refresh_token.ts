'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IRefreshTokenAttributes, IUserAttributes } from '../../types';

type TRefreshTokenCreationAttributes = Optional<IRefreshTokenAttributes, 'id'>;

class Refresh_Token extends Model<IRefreshTokenAttributes, TRefreshTokenCreationAttributes> implements IRefreshTokenAttributes {
    public id!: number;
    public userId!: number;
    public token!: string;
    public expiresAt!: Date;
    public revoked?: boolean;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;

    // Adding associations as optional properties
    public user?: IUserAttributes | undefined;
}

Refresh_Token.init(
    {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        revoked: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    },
    {
        sequelize: connection,
        modelName: 'Refresh_Token',
    },
);

export default Refresh_Token;

