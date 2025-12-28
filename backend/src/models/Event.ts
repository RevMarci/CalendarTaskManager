import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EventAttributes {
    id: number;
    title: string;
    start: Date;
    end?: Date;
    allDay: boolean;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'allDay'> {}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
    public id!: number;
    public title!: string;
    public start!: Date;
    public end!: Date;
    public allDay!: boolean;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Event.init(
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
        start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        allDay: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'events',
        timestamps: true,
    }
);

export default Event;