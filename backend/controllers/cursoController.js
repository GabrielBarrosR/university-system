const pool = require('../db');

exports.listarCursosPorEmail = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: 'Email do professor é obrigatório.' });
  }

  try {
    const conn = await pool.getConnection();

    const [professorRows] = await conn.query(
      'SELECT id FROM usuarios WHERE email = ? AND tipo LIKE "%professor%"',
      [email]
    );

    if (professorRows.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    const id_professor = professorRows[0].id;

    const [cursos] = await conn.query(
      `SELECT DISTINCT c.id, c.nome
       FROM cursos c
       JOIN turmas t ON t.id_curso = c.id
       WHERE t.id_professor = ?`,
      [id_professor]
    );

    conn.release();
    return res.json(cursos);
  } catch (error) {
    console.error('Erro ao listar cursos por email:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};
