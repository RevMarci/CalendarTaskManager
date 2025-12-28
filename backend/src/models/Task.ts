import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TaskAttributes {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    userId: number;
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
    },
    {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
    }
);

export default Task;