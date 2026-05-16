const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false } });

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/', async (req, res) => {
  const { name, sector, description, adoptionLevel } = req.body;
  if (!name) return res.status(400).json({ message: 'El campo name es requerido' });

  try {
    const result = await pool.query(
      `INSERT INTO technologies (name, sector, description, adoption_level)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, sector || null, description || null, adoptionLevel || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error interno', details: err.message });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`create-technology corriendo en puerto ${PORT}`)); 
