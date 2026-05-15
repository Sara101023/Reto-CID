 
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL, SSL: { REJECTUNAUTHORIZED: FALSE } });

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Crear startup
app.post('/', async (req, res) => {
  const { name, foundedAt, location, category, fundingAmount } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'El campo name es requerido' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO startups (name, founded_at, location, category, funding_amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, foundedAt || null, location || null, category || null, fundingAmount || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno', details: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`create-startup corriendo en puerto ${PORT}`));