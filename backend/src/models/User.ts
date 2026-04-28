import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
    id: number;
    password?: string;
    email: string;
    googleId?: string;
    discordWebhook?: string | null;
    eventNotificationsEnabled: boolean;
    eventNotificationType: 'email' | 'discord';
    dailySummaryEnabled: boolean;
    dailySummaryType: 'email' | 'discord';

    createdAt?: Date;
    updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'eventNotificationsEnabled' | 'eventNotificationType' | 'dailySummaryEnabled' | 'dailySummaryType'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public password?: string;
    public email!: string;
    public googleId?: string;
    public discordWebhook?: string | null;
    public eventNotificationsEnabled!: boolean;
    public eventNotificationType!: 'email' | 'discord';
    public dailySummaryEnabled!: boolean;
    public dailySummaryType!: 'email' | 'discord';
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        discordWebhook: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        eventNotificationsEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        eventNotificationType: {
            type: DataTypes.ENUM('email', 'discord'),
            defaultValue: 'email',
        },
        dailySummaryEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        dailySummaryType: {
            type: DataTypes.ENUM('email', 'discord'),
            defaultValue: 'email',
        },
    },
    {
        sequelize,
        tableName: 'user',
        timestamps: true,
    }
);

export default User;
