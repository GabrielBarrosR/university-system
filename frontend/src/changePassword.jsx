import React, { useState, useEffect } from 'react';

function RedefinirSenha({ onBack }) {
  const [user, setUser] = useState(null);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      setUser(JSON.parse(userStorage));
    } else {
      setMensagem('Usuário não encontrado no localStorage.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    let currentUser = user;

    if (!currentUser) {
      const userStorage = localStorage.getItem('user');
      currentUser = userStorage ? JSON.parse(userStorage) : null;
    }

    if (!currentUser || !currentUser.email || !currentUser.tipo) {
      setMensagem('Dados do usuário incompletos.');
      return;
    }

    if (novaSenha !== confirmaSenha) {
      setMensagem('A nova senha e a confirmação não coincidem.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/password/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          tipo: currentUser.tipo,
          senhaAtual,
          novaSenha,
        }),
      });

      const data = await response.json();
      setMensagem(data.message);
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <h2 style={styles.title}>Redefinir Senha</h2>

      <input
        type="password"
        placeholder="Senha Atual"
        value={senhaAtual}
        onChange={(e) => setSenhaAtual(e.target.value)}
        style={styles.input}
        required
      />

      <input
        type="password"
        placeholder="Nova Senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
        style={styles.input}
        required
      />

      <input
        type="password"
        placeholder="Confirmar Nova Senha"
        value={confirmaSenha}
        onChange={(e) => setConfirmaSenha(e.target.value)}
        style={styles.input}
        required
      />

      {mensagem && (
        <p
          role="alert"
          style={{
            color: mensagem.toLowerCase().includes('erro') ? 'red' : 'green',
            marginTop: 15,
            textAlign: 'center',
          }}
        >
          {mensagem}
        </p>
      )}

      <div style={styles.buttonGroup}>
        <button type="button" onClick={onBack} style={styles.backButton}>
          Voltar
        </button>
        <button type="submit" style={styles.submitButton}>
          Alterar Senha
        </button>
      </div>
    </form>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '30px',
    borderRadius: '10px',
    backgroundColor: '#f4f6f9',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
    fontFamily: '"Roboto", sans-serif',
  },
  title: {
    marginBottom: '20px',
    color: '#1e3d58',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: '12px 25px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  submitButton: {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default RedefinirSenha;
