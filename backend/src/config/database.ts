import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD; 
const dbHost = process.env.DB_HOST || 'localhost';

if (!dbName || !dbUser) {
    console.error('Error: Database name or user is not defined in environment variables.');
    process.exit(1);
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword || '', {
    host: dbHost,
    dialect: 'mysql',
    logging: false,
});

export default sequelize;