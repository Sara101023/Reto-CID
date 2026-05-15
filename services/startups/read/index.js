 const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Listar con filtros opcionales
app.get('/', async (req, res) => {
  const { name, category } = req.query;
  let query = 'SELECT * FROM startups WHERE 1=1';
  const params = [];

  if (name) {
    params.push(`%${name}%`);
    query += ` AND name ILIKE $${params.length}`;
  }
  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error interno', details: err.message });
  }
});

// Detalle por ID
app.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM startups WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error interno', details: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`read-startup corriendo en puerto ${PORT}`));
