import sequelize from './db.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health check status
let healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    checks: {}
};

// Check database connection
export const checkDatabase = async () => {
    try {
        await sequelize.authenticate();
        return {
            status: 'healthy',
            message: 'Database connection successful',
            details: {
                dialect: sequelize.getDialect(),
                host: sequelize.config.host,
                port: sequelize.config.port,
                database: sequelize.config.database
            }
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            message: 'Database connection failed',
            error: error.message
        };
    }
};

// Check Cloudinary connection
export const checkCloudinary = async () => {
    try {
        // Test Cloudinary configuration
        const config = cloudinary.config();
        if (!config.cloud_name || !config.api_key || !config.api_secret) {
            return {
                status: 'unhealthy',
                message: 'Cloudinary configuration incomplete',
                error: 'Missing required Cloudinary credentials'
            };
        }

        return {
            status: 'healthy',
            message: 'Cloudinary configuration valid',
            details: {
                cloud_name: config.cloud_name,
                api_key: config.api_key ? '***' + config.api_key.slice(-4) : 'not set',
                api_secret: config.api_secret ? '***' + config.api_secret.slice(-4) : 'not set'
            }
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            message: 'Cloudinary check failed',
            error: error.message
        };
    }
};

// Check disk space
export const checkDiskSpace = () => {
    try {
        // Use the same uploads directory path as upload utility
        const uploadsDir = path.join(process.cwd(), 'uploads');

        if (!fs.existsSync(uploadsDir)) {
            return {
                status: 'warning',
                message: 'Uploads directory does not exist',
                details: {
                    path: uploadsDir,
                    suggestion: 'Directory will be created automatically on first upload'
                }
            };
        }

        // Get directory stats
        const stats = fs.statSync(uploadsDir);
        const files = fs.readdirSync(uploadsDir);

        return {
            status: 'healthy',
            message: 'Disk space check successful',
            details: {
                uploads_directory: uploadsDir,
                files_count: files.length,
                directory_size: files.length > 0 ? 'Has files' : 'Empty',
                last_modified: stats.mtime.toISOString()
            }
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            message: 'Disk space check failed',
            error: error.message
        };
    }
};

// Check memory usage
export const checkMemoryUsage = () => {
    const memUsage = process.memoryUsage();
    const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
    };

    // Check if memory usage is reasonable (less than 1GB for heap)
    const isHealthy = memUsageMB.heapUsed < 1024;

    return {
        status: isHealthy ? 'healthy' : 'warning',
        message: isHealthy ? 'Memory usage normal' : 'High memory usage detected',
        details: {
            rss: `${memUsageMB.rss} MB`,
            heapTotal: `${memUsageMB.heapTotal} MB`,
            heapUsed: `${memUsageMB.heapUsed} MB`,
            external: `${memUsageMB.external} MB`
        }
    };
};

// Check environment variables
export const checkEnvironment = () => {
    const requiredEnvVars = [
        'DATABASE_URL',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];

    const missing = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        return {
            status: 'unhealthy',
            message: 'Missing required environment variables',
            error: `Missing: ${missing.join(', ')}`
        };
    }

    return {
        status: 'healthy',
        message: 'All required environment variables are set',
        details: {
            port: process.env.PORT || '5000 (default)',
            node_env: process.env.NODE_ENV || 'development',
            database_url: process.env.DATABASE_URL ? 'Set' : 'Not set',
            cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set'
        }
    };
};

// Comprehensive health check
export const performHealthCheck = async () => {
    const checks = {
        database: await checkDatabase(),
        cloudinary: checkCloudinary(),
        diskSpace: checkDiskSpace(),
        memory: checkMemoryUsage(),
        environment: checkEnvironment()
    };

    // Determine overall status
    const overallStatus = Object.values(checks).every(check => check.status === 'healthy')
        ? 'healthy'
        : Object.values(checks).some(check => check.status === 'unhealthy')
            ? 'unhealthy'
            : 'warning';

    healthStatus = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        checks
    };

    return healthStatus;
};

// Get cached health status
export const getHealthStatus = () => {
    return healthStatus;
};

// Update health status periodically
export const startHealthMonitoring = (intervalMs = 30000) => {
    setInterval(async () => {
        await performHealthCheck();
    }, intervalMs);

    console.log(`🔄 Health monitoring started (interval: ${intervalMs}ms)`);
};

// Detailed health check for debugging
export const getDetailedHealthCheck = async () => {
    const health = await performHealthCheck();

    // Add additional system information
    health.system = {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        memory_usage: process.memoryUsage(),
        cpu_usage: process.cpuUsage()
    };

    return health;
};
