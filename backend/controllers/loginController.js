const pool = require('../db');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? AND tipo = ?',
      [email, userType]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = rows[0];

    const senhaValida = await bcrypt.compare(password, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    return res.status(200).json({ tipo: user.tipo });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};
