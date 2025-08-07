import cloudinary from "../utils/cloudinary.js";
import Movie from "../models/Movie.js";
import streamifier from "streamifier";

export const uploadMovie = async (req, res) => {
    try {
        const { title, description, category, language, quality } = req.body;
        const files = req.files;

        if (!files || !files.video || !files.thumbnail) {
            return res.status(400).json({ error: "Both video and thumbnail files are required" });
        }

        // Upload thumbnail to Cloudinary
        const thumbnailUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => error ? reject(error) : resolve(result)
            );
            streamifier.createReadStream(files.thumbnail[0].buffer).pipe(uploadStream);
        });

        // Upload video to Cloudinary
        const videoUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "video" },
                (error, result) => error ? reject(error) : resolve(result)
            );
            streamifier.createReadStream(files.video[0].buffer).pipe(uploadStream);
        });

        console.log(videoUpload, thumbnailUpload, "Video and thumbnail uploaded successfully");


        // Save all data to MongoDB
        const movie = new Movie({
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

        await movie.save();
        res.status(201).json(movie);
    } catch (err) {
        console.log("Error uploading movie:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find(); // No projection, get all fields
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};