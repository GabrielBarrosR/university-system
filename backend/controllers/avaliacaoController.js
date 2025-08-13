const pool = require('../db');

exports.inserirAvaliacao = async (req, res) => {
    const { id_aluno, id_turma, nota, exame } = req.body;
    if (!id_aluno || !id_turma || !exame) {
    return res.status(400).json({ message: 'Campos obrigatórios: id_aluno, id_turma, exame.' });
    }

    if (nota === undefined || nota === null) {
    return res.status(400).json({ message: 'Informe uma nota.' });
    }

    try {
    const conn = await pool.getConnection();
    const query = `
        INSERT INTO avaliacoes (id_aluno, id_turma, nota, exames)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        nota = VALUES(nota)
    `;
    await conn.query(query, [id_aluno, id_turma, nota, exame]);
    conn.release();
    res.status(201).json({ message: 'Avaliação registrada com sucesso.' });
    } catch (e) {
    console.error('Erro ao inserir avaliação:', e);
    res.status(500).json({ message: 'Erro interno.' });
    }

};

exports.listarNotasPorAluno = async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: 'Email do aluno é obrigatório.' });
  }

  try {
    const conn = await pool.getConnection();

    const [usuarios] = await conn.query(
      'SELECT id FROM usuarios WHERE email = ? AND tipo = "aluno"',
      [email]
    );

    if (usuarios.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    const id_usuario = usuarios[0].id;

    const [notas] = await conn.query(
      `SELECT t.nome AS disciplina, CAST(a.nota AS DECIMAL(5,2)) AS nota,
       CASE WHEN a.nota >= 6 THEN 'Aprovado' ELSE 'Reprovado' END AS situacao
       FROM avaliacoes a
       JOIN turmas t ON a.id_turma = t.id
       JOIN alunos al ON a.id_aluno = al.matricula
       WHERE al.id_usuario = ?`,
      [id_usuario]
    );

    conn.release();
    return res.json(notas);

  } catch (error) {
    console.error('Erro ao listar notas por aluno:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

