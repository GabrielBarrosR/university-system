const pool = require('../db');

exports.listarAlunosPorTurma = async (req, res) => {
  const turmaId = req.params.id;

  if (!turmaId) {
    return res.status(400).json({ message: 'ID da turma é obrigatório.' });
  }

  try {
    const conn = await pool.getConnection();

    const [turmaRows] = await conn.query(
      'SELECT id_curso, id_periodo FROM turmas WHERE id = ?',
      [turmaId]
    );

    if (turmaRows.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Turma não encontrada.' });
    }

    const { id_curso, id_periodo } = turmaRows[0];

    const [alunos] = await conn.query(
      'SELECT matricula, nome FROM alunos WHERE id_curso = ? AND id_periodo = ?',
      [id_curso, id_periodo]
    );

    conn.release();
    return res.json(alunos);
  } catch (error) {
    console.error('Erro ao listar alunos por turma:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


exports.listarTurmasPorCursoEPeriodo = async (req, res) => {
  const { curso, periodo, email } = req.query;

  if (!curso || !periodo || !email) {
    return res.status(400).json({ message: 'Curso, período e email do professor são obrigatórios.' });
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

    const [turmas] = await conn.query(
      'SELECT id, nome FROM turmas WHERE id_curso = ? AND id_periodo = ? AND id_professor = ?',
      [curso, periodo, id_professor]
    );

    conn.release();
    return res.json(turmas);
  } catch (error) {
    console.error('Erro ao listar turmas:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

