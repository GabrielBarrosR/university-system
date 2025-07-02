const pool = require('../db');

exports.listarPeriodos = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [periodos] = await conn.query('SELECT id, nome FROM periodos');
    conn.release();
    res.json(periodos);
  } catch (error) {
    console.error('Erro ao buscar períodos:', error);
    res.status(500).json({ message: 'Erro interno ao buscar períodos.' });
  }
};
