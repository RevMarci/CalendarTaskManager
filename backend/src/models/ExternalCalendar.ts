import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ExternalCalendarAttributes {
    id: number;
    userId: number;
    name: string;
    url: string;
    color?: string;
    lastSyncedAt?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}

interface ExternalCalendarCreationAttributes extends Optional<ExternalCalendarAttributes, 'id'> {}

class ExternalCalendar extends Model<ExternalCalendarAttributes, ExternalCalendarCreationAttributes> implements ExternalCalendarAttributes {
    public id!: number;
    public userId!: number;
    public name!: string;
    public url!: string;
    public color?: string;
    public lastSyncedAt?: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ExternalCalendar.init(
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING(2048),
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastSyncedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'external_calendar',
        timestamps: true,
    }
);

export default ExternalCalendar;
