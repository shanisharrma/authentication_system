'use strict';

import { DataTypes, QueryInterface } from 'sequelize';
import { Enums } from '../../utils/constants';

const { ADMIN, MODERATOR, USER } = Enums.EUserRole;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
        await queryInterface.createTable('Roles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            role: {
                type: DataTypes.ENUM,
                values: [ADMIN, USER, MODERATOR],
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable('Roles');
    },
};

