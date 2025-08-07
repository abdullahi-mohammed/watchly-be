// models/Movie.js
import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js'; // Update with your actual Sequelize instance

const Movie = sequelize.define('Movie', {
    title: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    category: {
        type: DataTypes.STRING,
    },
    language: {
        type: DataTypes.STRING,
    },
    quality: {
        type: DataTypes.STRING,
    },
    thumbnail_url: {
        type: DataTypes.STRING,
    },
    thumbnail_id: {
        type: DataTypes.STRING,
    },
    cloudinary_url: {
        type: DataTypes.STRING,
    },
    cloudinary_id: {
        type: DataTypes.STRING,
    },
    format: {
        type: DataTypes.STRING,
    },
    duration: {
        type: DataTypes.INTEGER,
    },
    bytes: {
        type: DataTypes.BIGINT,
    },
    width: {
        type: DataTypes.INTEGER,
    },
    height: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'movies',
    timestamps: false, // or true if you want Sequelize to manage createdAt/updatedAt
});

export default Movie;
