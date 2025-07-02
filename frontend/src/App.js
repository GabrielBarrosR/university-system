import React, { useState } from 'react';
import Login from './Login';
import RedefinirSenha from './changePassword.jsx';

import {
  ConsultarNotas,
  ConsultarFaltas,
  CancelarMatricula,
  ConsultarGrade,
  VisualizarContratos,
  ConsultarHistorico
} from './components/aluno/AlunoFuncs';

import {
  CadastrarAluno,
  InserirNotas,
  InserirFaltas,
  AlterarCadastro
} from './components/professor/ProfessorFuncs';

function MenuAluno({ onLogout }) {
  const [page, setPage] = useState('notas');
  const [redefinirSenha, setRedefinirSenha] = useState(false);

  if (redefinirSenha) {
    return <RedefinirSenha onBack={() => setRedefinirSenha(false)} />;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Aluno</h1>
        <div>
          <button onClick={() => setRedefinirSenha(true)} style={styles.changePassword}>Redefinir Senha</button>
          <button onClick={onLogout} style={styles.logoutButton}>Sair</button>
        </div>
      </header>

      <div style={styles.navContainer}>
        <nav style={styles.nav}>
          <button onClick={() => setPage('notas')} style={styles.navButton}>Consultar Notas</button>
          <button onClick={() => setPage('faltas')} style={styles.navButton}>Consultar Faltas</button>
          <button onClick={() => setPage('cancelar')} style={styles.navButton}>Cancelar Matrícula</button>
          <button onClick={() => setPage('grade')} style={styles.navButton}>Consultar Grade de Horário</button>
          <button onClick={() => setPage('contratos')} style={styles.navButton}>Visualizar Contratos</button>
          <button onClick={() => setPage('historico')} style={styles.navButton}>Consultar Histórico</button>
        </nav>
      </div>

      <div style={styles.content}>
        {page === 'notas' && <ConsultarNotas />}
        {page === 'faltas' && <ConsultarFaltas />}
        {page === 'cancelar' && <CancelarMatricula />}
        {page === 'grade' && <ConsultarGrade />}
        {page === 'contratos' && <VisualizarContratos />}
        {page === 'historico' && <ConsultarHistorico />}
      </div>
    </div>
  );
}

function MenuProfessor({ onLogout }) {
  const [page, setPage] = useState('cadastrarAluno');
  const [redefinirSenha, setRedefinirSenha] = useState(false);

  if (redefinirSenha) {
    return <RedefinirSenha onBack={() => setRedefinirSenha(false)} />;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Professor</h1>
        <div>
          <button onClick={() => setRedefinirSenha(true)} style={styles.changePassword}>Redefinir Senha</button>
          <button onClick={onLogout} style={styles.logoutButton}>Sair</button>
        </div>
      </header>

      <div style={styles.navContainer}>
        <nav style={styles.nav}>
          <button onClick={() => setPage('cadastrarAluno')} style={styles.navButton}>Cadastrar Aluno</button>
          <button onClick={() => setPage('inserirNotas')} style={styles.navButton}>Inserir Notas</button>
          <button onClick={() => setPage('inserirFaltas')} style={styles.navButton}>Inserir Faltas</button>
          <button onClick={() => setPage('alterarCadastro')} style={styles.navButton}>Alterar Cadastro do Aluno</button>
        </nav>
      </div>

      <div style={styles.content}>
        {page === 'cadastrarAluno' && <CadastrarAluno />}
        {page === 'inserirNotas' && <InserirNotas />}
        {page === 'inserirFaltas' && <InserirFaltas />}
        {page === 'alterarCadastro' && <AlterarCadastro />}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (tipo, email) => {
    setUser({ tipo, email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.tipo === 'aluno') {
    return <MenuAluno onLogout={handleLogout} />;
  } else if (user.tipo === 'professor') {
    return <MenuProfessor onLogout={handleLogout} />;
  } 
  return null;
}

const styles = {
  container: {
    fontFamily: '"Roboto", sans-serif',
    backgroundColor: '#f4f6f9',
    padding: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
    borderRadius: '10px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e3d58',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '25px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
  },
  title: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff4c4c',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    marginLeft: '10px',
  },
  changePassword: {
    backgroundColor: '#20B2AA',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    marginRight: '10px',
  },
  navContainer: {
    marginBottom: '30px',
  },
  nav: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
  },
  navButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    transition: 'background-color 0.3s ease-in-out',
  },
  content: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  }
};
