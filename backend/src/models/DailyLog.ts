import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class DailyLog extends Model {
    public id!: number;
    public userId!: number;
    public date!: Date;
    public content!: string;
    public hash!: string;
    public transactionHash?: string;
}

DailyLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        transactionHash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'daily_logs',
        timestamps: true,
    }
);

export default DailyLog;
