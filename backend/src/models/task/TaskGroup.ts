import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface TaskGroupAttributes {
    id: number;
    title: string;
    taskBoardId: number;
    position?: number;

    createdAt?: Date;
    updatedAt?: Date;
}

interface TaskGroupCreationAttributes extends Optional<TaskGroupAttributes, 'id'> {}

class TaskGroup extends Model<TaskGroupAttributes, TaskGroupCreationAttributes> implements TaskGroupAttributes {
    public id!: number;
    public title!: string;
    public taskBoardId!: number;
    public position!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TaskGroup.init(
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
        taskBoardId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'task_group',
    }
);

export default TaskGroup;
