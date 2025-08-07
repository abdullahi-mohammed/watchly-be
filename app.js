import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sequelize from "./utils/db.js"; // ✅ Sequelize DB
import movieRoutes from "./routes/movie.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:8080",
            "http://localhost:5173",
            "https://watchly-fe-ycft.vercel.app",
            "watchly-fe-ycft.vercel.app",

        ],
    })
);

app.use("/api/movies", movieRoutes);

// ✅ Start server only after Sequelize connection is successful
const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ PostgreSQL connected via Sequelize");

        // Optional: sync models to DB
        await sequelize.sync({ alter: true }); // or use { force: true } to recreate tables

        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        process.exit(1); // stop process if DB fails
    }
};

startServer();
