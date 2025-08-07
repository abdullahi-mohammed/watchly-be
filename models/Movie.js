import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    language: String,
    quality: String,
    thumbnail_url: String,
    thumbnail_id: String,
    cloudinary_url: String,
    cloudinary_id: String,
    format: String,
    duration: Number,
    bytes: Number,
    width: Number,
    height: Number,
    created_at: Date,
});

export default mongoose.model("Movie", MovieSchema);