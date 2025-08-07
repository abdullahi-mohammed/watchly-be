import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import movieRoutes from "./routes/movie.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:8080",
            "http://localhost:5173"
        ],
    })
);

connectDB();
app.use("/api/movies", movieRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
});
