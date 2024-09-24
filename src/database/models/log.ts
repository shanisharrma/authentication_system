'use strict';
import { DataTypes, Model } from 'sequelize';
import connection from '../sequelize';
import { ILogAttributes } from '../../types';

class Log extends Model<ILogAttributes> implements ILogAttributes {
    public id!: number;
    public level!: string;
    public message!: string;
    public meta?: string | undefined;
    public timestamp!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Log.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        meta: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Date.now(),
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
        modelName: 'Log',
    },
);

export default Log;
