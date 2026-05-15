 const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.put('/:id', async (req, res) => {
  const allowed = ['name', 'foundedAt', 'location', 'category', 'fundingAmount'];
  const updates = [];
  const values = [];

  // Solo permite campos definidos
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      const dbKey = key === 'foundedAt' ? 'founded_at' : key === 'fundingAmount' ? 'funding_amount' : key;
      values.push(req.body[key]);
      updates.push(`${dbKey} = $${values.length}`);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No hay campos válidos para actualizar' });
  }

  values.push(req.params.id);
  const query = `UPDATE startups SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error interno', details: err.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`update-startup corriendo en puerto ${PORT}`));
