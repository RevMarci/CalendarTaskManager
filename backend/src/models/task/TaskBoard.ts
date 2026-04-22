import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface TaskBoardAttributes {
    id: number;
    title: string;
    userId: number;
    
    createdAt?: Date;
    updatedAt?: Date;
}

interface TaskBoardCreationAttributes extends Optional<TaskBoardAttributes, 'id'> {}

class TaskBoard extends Model<TaskBoardAttributes, TaskBoardCreationAttributes> implements TaskBoardAttributes {
    public id!: number;
    public title!: string;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TaskBoard.init(
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'task_board',
    }
);

export default TaskBoard;
