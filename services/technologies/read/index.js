 const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', async (req, res) => {
  const { sector, adoptionLevel } = req.query;
  let query = 'SELECT * FROM technologies WHERE 1=1';
  const params = [];

  if (sector) { params.push(sector); query += ` AND sector = $${params.length}`; }
  if (adoptionLevel) { params.push(adoptionLevel); query += ` AND adoption_level = $${params.length}`; }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error interno', details: err.message });
  }
});

app.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM technologies WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error interno', details: err.message });
  }
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`read-technology corriendo en puerto ${PORT}`));
