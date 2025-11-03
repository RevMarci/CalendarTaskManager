import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define(
    'Task',
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

        status: {
            type: DataTypes.ENUM('pending', 'completed'),
            defaultValue: 'pending',
        },

        description: {
            type: DataTypes.TEXT,
        },

        deadline: {
            type: DataTypes.DATE,
        },

        duration: {
            type: DataTypes.INTEGER, // minutes
        },

        startTime: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: 'tasks',
        timestamps: true,
    }
);

export default Task;
