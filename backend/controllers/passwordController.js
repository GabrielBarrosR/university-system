const pool = require('../db');
const bcrypt = require('bcrypt');

exports.redefinirSenha = async (req, res) => {

  const { email, senhaAtual, novaSenha, tipo } = req.body;

if (!email || !senhaAtual || !novaSenha || !tipo) {
  console.log('Valores recebidos:', { email, senhaAtual, novaSenha, tipo });
  return res.status(400).json({ 
    message: 'Email, senha atual, nova senha e tipo são obrigatórios.', 
    dadosRecebidos: { email, senhaAtual, novaSenha, tipo } 
  });
}


  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.query('SELECT senha FROM usuarios WHERE email = ? AND tipo = ?', [email, tipo]);

    if (rows.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const usuario = rows[0];
    const senhaNoBanco = usuario.senha;

    const pareceHash = senhaNoBanco.startsWith('$2b$') || senhaNoBanco.startsWith('$2a$');

    let senhaCorreta = false;

    if (pareceHash) {
      senhaCorreta = await bcrypt.compare(senhaAtual, senhaNoBanco);
    } else {
      senhaCorreta = senhaAtual === senhaNoBanco;

      if (senhaCorreta) {
        const senhaHash = await bcrypt.hash(senhaAtual, 10);
        await conn.query(
          'UPDATE usuarios SET senha = ? WHERE email = ? AND tipo = ?',
          [senhaHash, email, tipo]
        );
        console.log('Senha antiga migrada para hash.');
      }
    }

    if (!senhaCorreta) {
      conn.release();
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    const hashNovaSenha = await bcrypt.hash(novaSenha, 10);
    const [result] = await conn.query(
      'UPDATE usuarios SET senha = ? WHERE email = ? AND tipo = ?',
      [hashNovaSenha, email, tipo]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Erro ao atualizar a senha.' });
    }

    return res.json({ message: 'Senha atualizada com sucesso.' });

  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};
