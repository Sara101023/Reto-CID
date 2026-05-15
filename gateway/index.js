const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta principal (para que no de Cannot GET /)
app.get('/', (req, res) => {
    res.json({
        message: 'API Gateway funcionando correctamente',
        status: 'online',
        endpoints: {
            startups: {
                create: '/api/startups/create',
                read: '/api/startups/read',
                update: '/api/startups/update',
                delete: '/api/startups/delete'
            },
            technologies: {
                create: '/api/technologies/create',
                read: '/api/technologies/read',
                update: '/api/technologies/update',
                delete: '/api/technologies/delete'
            }
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// URLs de tus microservicios en Render
const SERVICES = {
    'startups-create': 'https://startups-create.onrender.com',
    'startups-read': 'https://startups-read.onrender.com',
    'startups-update': 'https://startups-update.onrender.com',
    'startups-delete': 'https://startups-delete.onrender.com',
    'techs-create': 'https://techs-create.onrender.com',
    'techs-read': 'https://techs-read.onrender.com',
    'techs-update': 'https://techs-update.onrender.com',
    'techs-delete': 'https://techs-delete.onrender.com'
};

// Proxy para Startups
app.use('/api/startups/create', createProxyMiddleware({
    target: SERVICES['startups-create'],
    changeOrigin: true,
    pathRewrite: { '^/api/startups/create': '' }
}));

app.use('/api/startups/read', createProxyMiddleware({
    target: SERVICES['startups-read'],
    changeOrigin: true,
    pathRewrite: { '^/api/startups/read': '' }
}));

app.use('/api/startups/update', createProxyMiddleware({
    target: SERVICES['startups-update'],
    changeOrigin: true,
    pathRewrite: { '^/api/startups/update': '' }
}));

app.use('/api/startups/delete', createProxyMiddleware({
    target: SERVICES['startups-delete'],
    changeOrigin: true,
    pathRewrite: { '^/api/startups/delete': '' }
}));

// Proxy para Technologies
app.use('/api/technologies/create', createProxyMiddleware({
    target: SERVICES['techs-create'],
    changeOrigin: true,
    pathRewrite: { '^/api/technologies/create': '' }
}));

app.use('/api/technologies/read', createProxyMiddleware({
    target: SERVICES['techs-read'],
    changeOrigin: true,
    pathRewrite: { '^/api/technologies/read': '' }
}));

app.use('/api/technologies/update', createProxyMiddleware({
    target: SERVICES['techs-update'],
    changeOrigin: true,
    pathRewrite: { '^/api/technologies/update': '' }
}));

app.use('/api/technologies/delete', createProxyMiddleware({
    target: SERVICES['techs-delete'],
    changeOrigin: true,
    pathRewrite: { '^/api/technologies/delete': '' }
}));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ API Gateway running on port ${PORT}`);
    console.log(`📡 Prueba en: https://gateway.onrender.com`);
});