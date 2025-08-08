import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sequelize from "./utils/db.js"; // ✅ Sequelize DB
import movieRoutes from "./routes/movie.js";
import healthRoutes from "./routes/health.js";
import { startHealthMonitoring } from "./utils/health.js";

dotenv.config();

const app = express();

// Increase limits for large file uploads
app.use(express.json({ limit: '2gb' }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: '2gb', extended: true }));

app.use(
    cors({
        origin: [
            "http://localhost:8080",
            "http://localhost:5173",
            "https://watchly-fe-ycft.vercel.app",
            "watchly-fe-ycft.vercel.app",
        ],
        credentials: true
    })
);

// Global error handling middleware
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// API routes
app.use("/api/movies", movieRoutes);

// Health check routes
app.use("/health", healthRoutes);

// Legacy health check endpoint (for backward compatibility)
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// ✅ Start server only after Sequelize connection is successful
const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ PostgreSQL connected via Sequelize");

        // Optional: sync models to DB
        await sequelize.sync({ alter: true }); // or use { force: true } to recreate tables

        // Start health monitoring
        startHealthMonitoring(30000); // Check every 30 seconds

        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            console.log(`📁 Upload directory: ${process.cwd()}/uploads`);
            console.log(`🏥 Health check: http://localhost:${port}/health`);
            console.log(`📊 Detailed health: http://localhost:${port}/health/detailed`);
            console.log(`🏓 Ping endpoint: http://localhost:${port}/health/ping`);
            console.log(`🔍 Readiness probe: http://localhost:${port}/health/ready`);
            console.log(`💓 Liveness probe: http://localhost:${port}/health/live`);
        });
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        process.exit(1); // stop process if DB fails
    }
};

startServer();
