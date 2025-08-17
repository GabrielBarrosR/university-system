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

    const [cursoRows] = await conn.query('SELECT id FROM cursos WHERE id = ?', [curso]);
    if (cursoRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Curso não encontrado' });
    }
    const id_curso = cursoRows[0].id;

    const id_periodo = periodo;

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
      `INSERT INTO alunos (nome, cpf, logradouro, numero, id_periodo, id_curso, id_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, cpf, logradouro, numero, id_periodo, id_curso, id_usuario]
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


exports.buscarAluno = async (req, res) => {
  const { matricula } = req.params;

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(`
      SELECT a.matricula, a.nome, a.cpf, a.logradouro, a.numero, a.id_periodo, c.nome AS curso
      FROM alunos a
      JOIN cursos c ON a.id_curso = c.id
      WHERE a.matricula = ?
    `, [matricula]);

    conn.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    return res.json(rows[0]);

  } catch (err) {
    console.error('Erro ao buscar aluno:', err);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

exports.atualizarAluno = async (req, res) => {
  const { matricula } = req.params;
  const { nome, cpf, logradouro, numero } = req.body;

  try {
    const conn = await pool.getConnection();

    const [result] = await conn.query(`
      UPDATE alunos
      SET nome = ?, cpf = ?, logradouro = ?, numero = ?
      WHERE matricula = ?
    `, [nome, cpf, logradouro, numero, matricula]);

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado ou dados iguais' });
    }

    return res.json({ message: 'Aluno atualizado com sucesso' });

  } catch (err) {
    console.error('Erro ao atualizar aluno:', err);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

exports.cancelarMatricula = async (req, res) => {
  const { email, userType} = req.body ;

  if (!email) {
    return res.status(400).json({ message: 'Email do aluno é obrigatório.' });
  }
  
    try{
    const conn = await pool.getConnection();
    
    const response = await conn.query('update alunos a join usuarios u on u.id = a.id_usuario set a.ativo = 0 where u.email = ? and u.tipo = ?', [email, userType]);
    res.status(200).json({ message: 'Matrícula cancelada com sucesso' });
    } catch (err) {
      res.status(500).json({error: 'Erro ao cancelar matrícula do aluno'})
    }
  }

exports.consultarMatricula = async (req, res) => {
  const {email} = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email do aluno é obrigatório.' });
  }

  try {
    const conn = await pool.getConnection();
    const [matricula] = await conn.query('SELECT a.matricula FROM alunos a JOIN usuarios u ON u.id = a.id_usuario WHERE u.email = ?', [email])
    
    res.status(200).json(matricula[0])

  }catch(error){
    res.status(500).json({error: 'Erro ao consultar matrícula do aluno'})
  }
}