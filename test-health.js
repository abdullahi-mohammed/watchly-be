import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

// Test all health check endpoints
async function testHealthEndpoints() {
    console.log('🏥 Testing Health Check System');
    console.log('==============================\n');

    const endpoints = [
        { path: '/health', name: 'Basic Health Check' },
        { path: '/health/detailed', name: 'Detailed Health Check' },
        { path: '/health/cached', name: 'Cached Health Check' },
        { path: '/health/ping', name: 'Ping Endpoint' },
        { path: '/health/ready', name: 'Readiness Probe' },
        { path: '/health/live', name: 'Liveness Probe' }
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`🔍 Testing: ${endpoint.name}`);
            console.log(`   URL: ${BASE_URL}${endpoint.path}`);

            const response = await fetch(`${BASE_URL}${endpoint.path}`);
            const data = await response.json();

            const status = response.ok ? '✅' : '❌';
            console.log(`   Status: ${status} ${response.status} ${response.statusText}`);
            console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
            console.log('');

        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            console.log('');
        }
    }
}

// Test health check with different scenarios
async function testHealthScenarios() {
    console.log('🧪 Testing Health Check Scenarios');
    console.log('=================================\n');

    // Test basic health check
    try {
        const response = await fetch(`${BASE_URL}/health`);
        const data = await response.json();

        console.log('📊 Health Status Analysis:');
        console.log(`   Overall Status: ${data.status}`);
        console.log(`   Success: ${data.success}`);
        console.log(`   Uptime: ${Math.round(data.uptime)} seconds`);
        console.log(`   Version: ${data.version}`);
        console.log('');

    } catch (error) {
        console.log(`❌ Health check failed: ${error.message}`);
    }

    // Test detailed health check
    try {
        const response = await fetch(`${BASE_URL}/health/detailed`);
        const data = await response.json();

        if (data.checks) {
            console.log('🔍 Detailed Health Checks:');
            Object.entries(data.checks).forEach(([check, details]) => {
                const status = details.status === 'healthy' ? '✅' :
                    details.status === 'warning' ? '⚠️' : '❌';
                console.log(`   ${status} ${check}: ${details.message}`);
            });
            console.log('');
        }

    } catch (error) {
        console.log(`❌ Detailed health check failed: ${error.message}`);
    }
}

// Test load balancer endpoints
async function testLoadBalancerEndpoints() {
    console.log('⚖️  Testing Load Balancer Endpoints');
    console.log('===================================\n');

    const lbEndpoints = [
        { path: '/health/ping', name: 'Ping' },
        { path: '/health/ready', name: 'Readiness' },
        { path: '/health/live', name: 'Liveness' }
    ];

    for (const endpoint of lbEndpoints) {
        try {
            const startTime = Date.now();
            const response = await fetch(`${BASE_URL}${endpoint.path}`);
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const data = await response.json();
            const status = response.ok ? '✅' : '❌';

            console.log(`${status} ${endpoint.name}:`);
            console.log(`   Response Time: ${responseTime}ms`);
            console.log(`   Status Code: ${response.status}`);
            console.log(`   Message: ${data.message}`);
            console.log('');

        } catch (error) {
            console.log(`❌ ${endpoint.name} failed: ${error.message}`);
            console.log('');
        }
    }
}

// Main test function
async function runHealthTests() {
    console.log('🚀 Starting Health Check Tests...\n');

    await testHealthEndpoints();
    await testHealthScenarios();
    await testLoadBalancerEndpoints();

    console.log('✅ Health check tests completed!');
    console.log('\n📋 Summary:');
    console.log('   - Basic health check: /health');
    console.log('   - Detailed monitoring: /health/detailed');
    console.log('   - Fast cached check: /health/cached');
    console.log('   - Load balancer ping: /health/ping');
    console.log('   - Kubernetes readiness: /health/ready');
    console.log('   - Kubernetes liveness: /health/live');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runHealthTests().catch(console.error);
}

export { runHealthTests };
