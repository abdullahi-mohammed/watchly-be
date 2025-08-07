import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Movie = sequelize.define("Movie", {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    language: DataTypes.STRING,
    quality: DataTypes.STRING,
    thumbnail_url: DataTypes.STRING,
    thumbnail_id: DataTypes.STRING,
    cloudinary_url: DataTypes.STRING,
    cloudinary_id: DataTypes.STRING,
    format: DataTypes.STRING,
    duration: DataTypes.FLOAT, // ✅ CHANGED from INTEGER to FLOAT
    bytes: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    created_at: DataTypes.DATE
}, {
    tableName: 'movies',
    timestamps: false, // or true if you want Sequelize to auto-manage timestamps
});

export default Movie;
