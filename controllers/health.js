import {
    performHealthCheck,
    getHealthStatus,
    getDetailedHealthCheck
} from '../utils/health.js';

// Basic health check endpoint
export const healthCheck = async (req, res) => {
    try {
        const health = await performHealthCheck();

        const statusCode = health.status === 'healthy' ? 200 :
            health.status === 'warning' ? 200 : 503;

        res.status(statusCode).json({
            success: health.status === 'healthy',
            status: health.status,
            message: health.status === 'healthy' ? 'Server is healthy' : 'Server has issues',
            timestamp: health.timestamp,
            uptime: health.uptime,
            version: health.version
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            message: 'Health check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Detailed health check endpoint
export const detailedHealthCheck = async (req, res) => {
    try {
        const health = await getDetailedHealthCheck();

        const statusCode = health.status === 'healthy' ? 200 :
            health.status === 'warning' ? 200 : 503;

        res.status(statusCode).json({
            success: health.status === 'healthy',
            status: health.status,
            message: health.status === 'healthy' ? 'Server is healthy' : 'Server has issues',
            timestamp: health.timestamp,
            uptime: health.uptime,
            version: health.version,
            checks: health.checks,
            system: health.system
        });
    } catch (error) {
        console.error('Detailed health check error:', error);
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            message: 'Detailed health check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Cached health check endpoint (faster response)
export const cachedHealthCheck = (req, res) => {
    try {
        const health = getHealthStatus();

        const statusCode = health.status === 'healthy' ? 200 :
            health.status === 'warning' ? 200 : 503;

        res.status(statusCode).json({
            success: health.status === 'healthy',
            status: health.status,
            message: health.status === 'healthy' ? 'Server is healthy' : 'Server has issues',
            timestamp: health.timestamp,
            uptime: health.uptime,
            version: health.version,
            cached: true
        });
    } catch (error) {
        console.error('Cached health check error:', error);
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            message: 'Cached health check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Health check for load balancers (simple ping)
export const ping = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'pong',
        timestamp: new Date().toISOString()
    });
};

// Readiness check (for Kubernetes)
export const readinessCheck = async (req, res) => {
    try {
        const health = await performHealthCheck();

        // For readiness, we only care about critical services
        const criticalChecks = ['database', 'environment'];
        const criticalStatus = criticalChecks.every(check =>
            health.checks[check]?.status === 'healthy'
        );

        const statusCode = criticalStatus ? 200 : 503;

        res.status(statusCode).json({
            success: criticalStatus,
            status: criticalStatus ? 'ready' : 'not ready',
            message: criticalStatus ? 'Service is ready' : 'Service is not ready',
            timestamp: health.timestamp,
            critical_checks: criticalChecks.reduce((acc, check) => {
                acc[check] = health.checks[check]?.status || 'unknown';
                return acc;
            }, {})
        });
    } catch (error) {
        console.error('Readiness check error:', error);
        res.status(503).json({
            success: false,
            status: 'not ready',
            message: 'Readiness check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Liveness check (for Kubernetes)
export const livenessCheck = (req, res) => {
    // Simple check to see if the process is alive
    const uptime = process.uptime();
    const isAlive = uptime > 0;

    const statusCode = isAlive ? 200 : 503;

    res.status(statusCode).json({
        success: isAlive,
        status: isAlive ? 'alive' : 'dead',
        message: isAlive ? 'Process is alive' : 'Process is not responding',
        uptime: uptime,
        timestamp: new Date().toISOString()
    });
};
