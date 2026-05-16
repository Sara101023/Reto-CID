const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: ['https://reto-cid-frontend.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const SERVICES = {
  'startups-create': 'https://startups-create.onrender.com',
  'startups-read':   'https://startups-read.onrender.com',
  'startups-update': 'https://startups-update.onrender.com',
  'startups-delete': 'https://startups-delete.onrender.com',
  'techs-create':    'https://techs-create.onrender.com',
  'techs-read':      'https://techs-read.onrender.com',
  'techs-update':    'https://techs-update.onrender.com',
  'techs-delete':    'https://techs-delete.onrender.com'
};

app.get('/', (req, res) => {
  res.json({ status: 'gateway ok', version: 'v1', endpoints: {
    startups: '/v1/api/startups/create|read|update|delete',
    technologies: '/v1/api/technologies/create|read|update|delete'
  }});
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/status', async (req, res) => {
  const checks = await Promise.allSettled([
    axios.get(`${SERVICES['startups-read']}/health`, { timeout: 5000 }),
    axios.get(`${SERVICES['techs-read']}/health`, { timeout: 5000 })
  ])

  const allUp = checks.every(c => c.status === 'fulfilled')

  res.status(allUp ? 200 : 503).json({
    status: allUp ? 'ok' : 'degraded',
    services: {
      'startups-read': checks[0].status === 'fulfilled' ? 'up' : 'down',
      'techs-read': checks[1].status === 'fulfilled' ? 'up' : 'down'
    }
  })
})

async function proxy(req, res, serviceUrl, path) {
  try {
    const response = await axios({
      method: req.method,
      url: `${serviceUrl}${path}`,
      data: req.body,
      params: req.query,
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    res.status(status).json(data);
  }
}

// Startups
app.all('/v1/api/startups/create',     (req, res) => proxy(req, res, SERVICES['startups-create'], '/'));
app.all('/v1/api/startups/read',       (req, res) => proxy(req, res, SERVICES['startups-read'], '/'));
app.all('/v1/api/startups/read/:id',   (req, res) => proxy(req, res, SERVICES['startups-read'], `/${req.params.id}`));
app.all('/v1/api/startups/update/:id', (req, res) => proxy(req, res, SERVICES['startups-update'], `/${req.params.id}`));
app.all('/v1/api/startups/delete/:id', (req, res) => proxy(req, res, SERVICES['startups-delete'], `/${req.params.id}`));

// Technologies
app.all('/v1/api/technologies/create',     (req, res) => proxy(req, res, SERVICES['techs-create'], '/'));
app.all('/v1/api/technologies/read',       (req, res) => proxy(req, res, SERVICES['techs-read'], '/'));
app.all('/v1/api/technologies/read/:id',   (req, res) => proxy(req, res, SERVICES['techs-read'], `/${req.params.id}`));
app.all('/v1/api/technologies/update/:id', (req, res) => proxy(req, res, SERVICES['techs-update'], `/${req.params.id}`));
app.all('/v1/api/technologies/delete/:id', (req, res) => proxy(req, res, SERVICES['techs-delete'], `/${req.params.id}`));

app.listen(PORT, () => console.log(`Gateway corriendo en puerto ${PORT}`));