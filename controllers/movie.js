import cloudinary from "../utils/cloudinary.js";
import Movie from "../models/Movie.js";
import { uploadToCloudinary, cleanupFiles } from "../utils/upload.js";

export const uploadMovie = async (req, res) => {
    try {
        const { title, description, category, language, quality } = req.body;
        const files = req.files;

        if (!files || !files.video || !files.thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Both video and thumbnail files are required"
            });
        }

        const videoFile = files.video[0];
        const thumbnailFile = files.thumbnail[0];

        console.log(`Processing video: ${videoFile.originalname} (${videoFile.size} bytes)`);
        console.log(`Processing thumbnail: ${thumbnailFile.originalname} (${thumbnailFile.size} bytes)`);

        // Upload thumbnail to Cloudinary using disk storage
        let thumbnailUpload;
        try {
            thumbnailUpload = await uploadToCloudinary(thumbnailFile.path, 'image', {
                transformation: [
                    { width: 300, height: 200, crop: 'fill' }
                ]
            });
            console.log('Thumbnail uploaded successfully:', thumbnailUpload.secure_url);
        } catch (error) {
            console.error('Thumbnail upload failed:', error);
            cleanupFiles(files);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload thumbnail: ' + error.message
            });
        }

        // Upload video to Cloudinary using disk storage
        let videoUpload;
        try {
            videoUpload = await uploadToCloudinary(videoFile.path, 'video', {
                resource_type: 'video',
                chunk_size: 6000000, // 6MB chunks for better streaming
                eager: [
                    { width: 1280, height: 720, crop: 'scale' },
                    { width: 854, height: 480, crop: 'scale' }
                ],
                eager_async: true
            });
            console.log('Video uploaded successfully:', videoUpload.secure_url);
        } catch (error) {
            console.error('Video upload failed:', error);
            cleanupFiles(files);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload video: ' + error.message
            });
        }

        // Clean up uploaded files from disk
        cleanupFiles(files);

        // Save movie to PostgreSQL via Sequelize
        const movie = await Movie.create({
            title,
            description,
            category,
            language,
            quality,
            thumbnail_url: thumbnailUpload.secure_url,
            thumbnail_id: thumbnailUpload.public_id,
            cloudinary_url: videoUpload.secure_url,
            cloudinary_id: videoUpload.public_id,
            format: videoUpload.format,
            duration: videoUpload.duration,
            bytes: videoUpload.bytes,
            width: videoUpload.width,
            height: videoUpload.height,
            created_at: videoUpload.created_at,
        });

        res.status(201).json({
            success: true,
            message: 'Movie uploaded successfully',
            data: movie
        });

    } catch (err) {
        console.error("Error uploading movie:", err);

        // Clean up files if they exist
        if (req.files) {
            cleanupFiles(req.files);
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + err.message
        });
    }
};

export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll(); // Sequelize method
        res.status(200).json({
            success: true,
            data: movies
        });
    } catch (err) {
        console.error("Error fetching movies:", err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch movies: ' + err.message
        });
    }
};

// Add new endpoint for single movie
export const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByPk(id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        res.status(200).json({
            success: true,
            data: movie
        });
    } catch (err) {
        console.error("Error fetching movie:", err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch movie: ' + err.message
        });
    }
};

// Add update movie endpoint
export const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const movie = await Movie.findByPk(id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        await movie.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Movie updated successfully',
            data: movie
        });
    } catch (err) {
        console.error("Error updating movie:", err);
        res.status(500).json({
            success: false,
            message: 'Failed to update movie: ' + err.message
        });
    }
};

// Add delete movie endpoint
export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await Movie.findByPk(id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        // Delete from Cloudinary if IDs exist
        if (movie.cloudinary_id) {
            try {
                await cloudinary.uploader.destroy(movie.cloudinary_id, { resource_type: 'video' });
                console.log('Video deleted from Cloudinary');
            } catch (error) {
                console.error('Error deleting video from Cloudinary:', error);
            }
        }

        if (movie.thumbnail_id) {
            try {
                await cloudinary.uploader.destroy(movie.thumbnail_id, { resource_type: 'image' });
                console.log('Thumbnail deleted from Cloudinary');
            } catch (error) {
                console.error('Error deleting thumbnail from Cloudinary:', error);
            }
        }

        // Delete from database
        await movie.destroy();

        res.status(200).json({
            success: true,
            message: 'Movie deleted successfully'
        });
    } catch (err) {
        console.error("Error deleting movie:", err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete movie: ' + err.message
        });
    }
};
