import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TaskAttributes {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    userId: number;
    deadLine?: Date;
    duration?: number; // in minutes
    startTime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'status'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public status!: 'pending' | 'completed';
    public userId!: number;
    public deadLine!: Date;
    public duration!: number;
    public startTime!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed'),
            defaultValue: 'pending',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deadLine: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        duration: {
            type: DataTypes.INTEGER,    // minutes
            allowNull: true,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
    }
);

export default Task;