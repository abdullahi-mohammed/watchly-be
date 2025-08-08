// file: sequelize.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from "dotenv";

dotenv.config();
const sequelize = new Sequelize(process.env.POSTGRESQL_DB_STRING, {
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
