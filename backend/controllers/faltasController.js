const pool = require('../db');

exports.inserirFalta = async (req, res) => {
  const { id_aluno, id_turma, falta, tipo } = req.body;

  if (!id_aluno || !id_turma || falta === undefined || falta === null || !tipo) {
    return res.status(400).json({ message: 'Campos obrigatórios: id_aluno, id_turma, falta, tipo.' });
  }

  try {
    const conn = await pool.getConnection();

    const query = `
      INSERT INTO faltas (id_aluno, id_turma, falta, tipo)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        falta = VALUES(falta),
        tipo = VALUES(tipo)
    `;

    await conn.query(query, [id_aluno, id_turma, falta, tipo]);
    conn.release();

    res.status(201).json({ message: 'Falta registrada com sucesso.' });
  } catch (error) {
    console.error('Erro ao inserir falta:', error);
    res.status(500).json({ message: 'Erro interno.' });
  }
};
