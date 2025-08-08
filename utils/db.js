// file: sequelize.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from "dotenv";

dotenv.config();

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRESQL_DB_STRING;

if (!databaseUrl) {
    console.error('❌ Database URL not found in environment variables');
    console.error('Please set DATABASE_URL or POSTGRESQL_DB_STRING in your .env file');
    process.exit(1);
}

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default sequelize;
