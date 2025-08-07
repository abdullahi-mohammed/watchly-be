import express from "express";
import multer from "multer";
import { uploadMovie, getMovies } from "../controllers/movie.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Accept both 'thumbnail' and 'video' fields
router.post("/upload", upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
]), uploadMovie);

router.get("/", getMovies);

export default router;