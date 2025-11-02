import DataTypes from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define(
    'Event',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'events',
        timestamps: true,
    }
);

export default Event;
