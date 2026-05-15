const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Gateway is running' });
});

// URLs de tus microservicios en Render (REEMPLAZA con tus URLs reales)
const SERVICES = {
    // Startups
    'startups-create': process.env.CREATE_STARTUP_URL || 'https://startups-create.onrender.com',
    'startups-read': process.env.READ_STARTUP_URL || 'https://startups-read.onrender.com',
    'startups-update': process.env.UPDATE_STARTUP_URL || 'https://startups-update.onrender.com',
    'startups-delete': process.env.DELETE_STARTUP_URL || 'https://startups-delete.onrender.com',
    
    // Technologies
    'techs-create': process.env.CREATE_TECH_URL || 'https://techs-create.onrender.com',
    'techs-read': process.env.READ_TECH_URL || 'https://techs-read.onrender.com',
    'techs-update': process.env.UPDATE_TECH_URL || 'https://techs-update.onrender.com',
    'techs-delete': process.env.DELETE_TECH_URL || 'https://techs-delete.onrender.com'
};

// Proxy para Startups - CREATE
app.use('/api/startups/create', createProxyMiddleware({
    target: SERVICES['startups-create'],
    changeOrigin: true,
    pathRewrite: { '^/api/startups/create': '' }
}));

// Proxy para Startups - READ
app.use('/api/startups/read', createProxyMiddleware({
    target: SERVICES['startups-read'],
    changeOrigin: true,
    pathRewrite: { '^/api/startups/read': '' }
}));

// Proxy para Startups - UPDATE
app.use('/api/startups/update', createProxyMiddleware({
    target: SERVICES['startups-update'],
    changeOrigin: true,
    pathRewrite: { '^/api/startups/update': '' }
}));

// Proxy para Startups - DELETE
app.use('/api/startups/delete', createProxyMiddleware({
    target: SERVICES['startups-delete'],
    changeOrigin: true,
    pathRewrite: { '^/api/startups/delete': '' }
}));

// Proxy para Technologies - CREATE
app.use('/api/technologies/create', createProxyMiddleware({
    target: SERVICES['techs-create'],
    changeOrigin: true,
    pathRewrite: { '^/api/technologies/create': '' }
}));

// Proxy para Technologies - READ
app.use('/api/technologies/read', createProxyMiddleware({
    target: SERVICES['techs-read'],
    changeOrigin: true,
    pathRewrite: { '^/api/technologies/read': '' }
}));

// Proxy para Technologies - UPDATE
app.use('/api/technologies/update', createProxyMiddleware({
    target: SERVICES['techs-update'],
    changeOrigin: true,
    pathRewrite: { '^/api/technologies/update': '' }
}));

// Proxy para Technologies - DELETE
app.use('/api/technologies/delete', createProxyMiddleware({
    target: SERVICES['techs-delete'],
    changeOrigin: true,
    pathRewrite: { '^/api/technologies/delete': '' }
}));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log('Proxies configurados:');
    Object.keys(SERVICES).forEach(service => {
        console.log(`  - /api/${service.replace('-', '/')} -> ${SERVICES[service]}`);
    });
});