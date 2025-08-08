import express from "express";
import { upload, handleUploadError } from "../utils/upload.js";
import {
    uploadMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie
} from "../controllers/movie.js";

const router = express.Router();

// Upload route with disk storage and error handling
router.post("/upload",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "video", maxCount: 1 }
    ]),
    handleUploadError,
    uploadMovie
);

// Get all movies
router.get("/", getMovies);

// Get movie by ID
router.get("/:id", getMovieById);

// Update movie
router.put("/:id", updateMovie);

// Delete movie
router.delete("/:id", deleteMovie);

export default router;