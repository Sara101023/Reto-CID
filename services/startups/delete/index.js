 const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM startups WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error interno', details: err.message });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`delete-startup corriendo en puerto ${PORT}`));
