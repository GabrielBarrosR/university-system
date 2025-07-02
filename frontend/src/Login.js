import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !userType) {
      setErrorMessage('Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('user', JSON.stringify({
          email,
          tipo: data.tipo,
        }));

        onLogin(data.tipo, email);
        setErrorMessage('');
      } else {
        const error = await response.json();
        setErrorMessage(error.message || 'Credenciais inválidas');
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar no servidor');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      <h2 style={formStyles.title}>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={formStyles.input}
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={formStyles.input}
        required
      />

      <select
        value={userType}
        onChange={e => setUserType(e.target.value)}
        style={formStyles.select}
        required
      >
        <option value="">Selecione o tipo de usuário</option>
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
      </select>

      <button type="submit" style={formStyles.button}>Entrar</button>

      {errorMessage && (
        <p role="alert" style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}

const formStyles = {
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
  select: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Login;
