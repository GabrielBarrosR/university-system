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

exports.consultasFaltas = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email do aluno é obrigatório.' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const [faltas] = await conn.query(`
      SELECT t.nome AS disciplina, f.tipo, f.falta
      FROM faltas f
      JOIN turmas t ON f.id_turma = t.id
      JOIN alunos a ON f.id_aluno = a.matricula
      JOIN usuarios u ON a.id_usuario = u.id
      WHERE u.email = ? AND u.tipo = "aluno"
    `, [email]);

    conn.release();

    if (!faltas || faltas.length === 0) {
      return res.status(404).json({ message: 'Faltas não encontradas.' });
    }

    return res.json(faltas);

  } catch (error) {
    console.error('Erro ao consultar faltas:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  } finally {
    if (conn) conn.release();
  }
};
