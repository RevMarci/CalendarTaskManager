import DataTypes from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define(
    'User',
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
    },
    {
        tableName: 'tasks',
        timestamps: true,
    }
);

export default Task;
