const pool = require('../db');
const bcrypt = require('bcrypt');

function gerarEmail(nome, matricula) {
  return `${nome.toLowerCase().replace(/\s/g, '')}${matricula}@libelula.com`;
}

exports.cadastrarAluno = async (req, res) => {
  const { nome, cpf, logradouro, numero, curso, periodo } = req.body;

  try {
    const conn = await pool.getConnection();

    await conn.beginTransaction();

    const [cursoRows] = await conn.query('SELECT id FROM cursos WHERE nome = ?', [curso]);

    if (cursoRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Curso não encontrado' });
    }

    const id_curso = cursoRows[0].id;

    const senhaFixa = '123456';
    const tipo = 'aluno';


    const senhaHash = await bcrypt.hash(senhaFixa, 10);

    const emailTemporario = 'temp@email.com';

    const [userResult] = await conn.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, emailTemporario, senhaHash, tipo]
    );

    const id_usuario = userResult.insertId;

    const [alunoResult] = await conn.query(
      `INSERT INTO alunos (nome, cpf, logradouro, numero, periodo, id_curso, id_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, cpf, logradouro, numero, periodo, id_curso, id_usuario]
    );

    const matricula = alunoResult.insertId;

    const emailFinal = gerarEmail(nome, matricula);

    await conn.query('UPDATE usuarios SET email = ? WHERE id = ?', [emailFinal, id_usuario]);

    await conn.commit();
    conn.release();

    return res.status(201).json({
      message: 'Aluno cadastrado com sucesso',
      matricula,
      email: emailFinal,
      senha: senhaFixa, 
    });

  } catch (err) {
    console.error('Erro ao cadastrar aluno:', err);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};
