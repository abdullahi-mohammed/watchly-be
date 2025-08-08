import express from 'express';
import {
    healthCheck,
    detailedHealthCheck,
    cachedHealthCheck,
    ping,
    readinessCheck,
    livenessCheck
} from '../controllers/health.js';

const router = express.Router();

// Basic health check
router.get('/', healthCheck);

// Detailed health check with all system information
router.get('/detailed', detailedHealthCheck);

// Cached health check (faster response)
router.get('/cached', cachedHealthCheck);

// Simple ping for load balancers
router.get('/ping', ping);

// Kubernetes readiness probe
router.get('/ready', readinessCheck);

// Kubernetes liveness probe
router.get('/live', livenessCheck);

export default router;
