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
