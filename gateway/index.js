const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
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
  res.json({ status: 'gateway ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Función proxy genérica
async function proxy(req, res, serviceUrl, path) {
  try {
    const url = `${serviceUrl}${path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    const response = await axios({
      method: req.method,
      url,
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
app.all('/api/startups/create',     (req, res) => proxy(req, res, SERVICES['startups-create'], '/'));
app.all('/api/startups/read',       (req, res) => proxy(req, res, SERVICES['startups-read'], '/'));
app.all('/api/startups/read/:id',   (req, res) => proxy(req, res, SERVICES['startups-read'], `/${req.params.id}`));
app.all('/api/startups/update/:id', (req, res) => proxy(req, res, SERVICES['startups-update'], `/${req.params.id}`));
app.all('/api/startups/delete/:id', (req, res) => proxy(req, res, SERVICES['startups-delete'], `/${req.params.id}`));

// Technologies
app.all('/api/technologies/create',     (req, res) => proxy(req, res, SERVICES['techs-create'], '/'));
app.all('/api/technologies/read',       (req, res) => proxy(req, res, SERVICES['techs-read'], '/'));
app.all('/api/technologies/read/:id',   (req, res) => proxy(req, res, SERVICES['techs-read'], `/${req.params.id}`));
app.all('/api/technologies/update/:id', (req, res) => proxy(req, res, SERVICES['techs-update'], `/${req.params.id}`));
app.all('/api/technologies/delete/:id', (req, res) => proxy(req, res, SERVICES['techs-delete'], `/${req.params.id}`));

app.listen(PORT, () => console.log(`Gateway corriendo en puerto ${PORT}`));