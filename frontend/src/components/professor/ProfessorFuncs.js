import React, { useState, useEffect } from 'react';

export function CadastrarAluno() {
  const [name, setName] = useState('');
  const [CPF, setCPF] = useState('');
  const [Street, setStreet] = useState('');
  const [Number, setNumber] = useState('');
  const [Curse, setCurse] = useState('');
  const [Period, setPeriod] = useState('');
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) return;

    async function fetchCursos() {
      try {
        const res = await fetch(`http://localhost:3001/api/cursos/professor?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setCursos(data);
      } catch (err) {
        console.error('Erro ao buscar cursos:', err);
      }
    }

    async function fetchPeriodos() {
      try {
        const res = await fetch('http://localhost:3001/api/periodos');
        const data = await res.json();
        setPeriodos(data);
      } catch (err) {
        console.error('Erro ao buscar períodos:', err);
      }
    }

    fetchCursos();
    fetchPeriodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: name,
          cpf: CPF,
          logradouro: Street,
          numero: Number,
          curso: Curse,
          periodo: Period
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Aluno cadastrado com sucesso!
Email: ${data.email}
Senha: ${data.senha}
Matrícula: ${data.matricula}`);

        setName('');
        setCPF('');
        setStreet('');
        setNumber('');
        setCurse('');
        setPeriod('');
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      <h2 style={formStyles.title}>Cadastrar Aluno</h2>

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
        style={formStyles.input}
        required
      />

      <input
        type="text"
        placeholder="CPF"
        value={CPF}
        onChange={e => setCPF(e.target.value)}
        style={formStyles.input}
        required
      />

      <input
        type="text"
        placeholder="Logradouro"
        value={Street}
        onChange={e => setStreet(e.target.value)}
        style={formStyles.input}
        required
      />

      <input
        type="number"
        placeholder="Número"
        value={Number}
        onChange={e => setNumber(e.target.value)}
        style={formStyles.input}
        required
      />

      <select
        value={Curse}
        onChange={e => setCurse(e.target.value)}
        style={formStyles.select}
        required
      >
        <option value="">Selecione o curso</option>
        {cursos.map(c => (
          <option key={c.id} value={c.id}>{c.nome}</option>
        ))}
      </select>

      <select
        value={Period}
        onChange={e => setPeriod(e.target.value)}
        style={formStyles.select}
        required
      >
        <option value="">Selecione o período</option>
        {periodos.map(p => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>

      <button type="submit" style={formStyles.button}>Cadastrar</button>
    </form>
  );
}

export function InserirNotas() {
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);

  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [nota, setNota] = useState('');
  const [exame, setExame] = useState('');

  useEffect(() => {
    async function fetchCursos() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) return;

      try {
        const res = await fetch(`http://localhost:3001/api/cursos/professor?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setCursos(data);
      } catch (err) {
        console.error('Erro ao buscar cursos:', err);
      }
    }

    async function fetchPeriodos() {
      try {
        const res = await fetch('http://localhost:3001/api/periodos');
        const data = await res.json();
        setPeriodos(data);
      } catch (err) {
        console.error('Erro ao buscar períodos:', err);
      }
    }

    fetchCursos();
    fetchPeriodos();
  }, []);

  useEffect(() => {
    async function fetchTurmas() {
      if (!cursoSelecionado || !periodoSelecionado) return;

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) return;

      try {
        const res = await fetch(`http://localhost:3001/api/turmas?curso=${cursoSelecionado}&periodo=${periodoSelecionado}&email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setTurmas(data);
      } catch (err) {
        console.error('Erro ao buscar turmas:', err);
        setTurmas([]);
      }

      setTurmaSelecionada('');
      setAlunos([]);
      setAlunoSelecionado('');
    }

    fetchTurmas();
  }, [cursoSelecionado, periodoSelecionado]);

  useEffect(() => {
    async function fetchAlunos() {
      if (!turmaSelecionada) return;

      try {
        const res = await fetch(`http://localhost:3001/api/turmas/${turmaSelecionada}/alunos`);
        const data = await res.json();
        setAlunos(data);
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        setAlunos([]);
      }

      setAlunoSelecionado('');
    }

    fetchAlunos();
  }, [turmaSelecionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cursoSelecionado || !periodoSelecionado || !turmaSelecionada || !alunoSelecionado || !exame) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (nota === '') {
      alert('Informe a nota.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_aluno: alunoSelecionado, 
          id_turma: turmaSelecionada,
          nota: parseFloat(nota),
          exame,
        }),
      });

      if (response.ok) {
        alert('Nota cadastrada com sucesso!');
        setCursoSelecionado('');
        setPeriodoSelecionado('');
        setTurmaSelecionada('');
        setAlunoSelecionado('');
        setNota('');
        setExame('');
        setTurmas([]);
        setAlunos([]);
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      <h2 style={formStyles.title}>Inserir Nota</h2>

      <select
        value={cursoSelecionado}
        onChange={e => setCursoSelecionado(e.target.value)}
        style={formStyles.select}
        required
      >
        <option value="">Selecione o curso</option>
        {cursos.map(c => (
          <option key={c.id} value={c.id}>{c.nome}</option>
        ))}
      </select>

      <select
        value={periodoSelecionado}
        onChange={e => setPeriodoSelecionado(e.target.value)}
        style={formStyles.select}
        required
      >
        <option value="">Selecione o período</option>
        {periodos.map(p => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>

      <select
        value={turmaSelecionada}
        onChange={e => setTurmaSelecionada(e.target.value)}
        style={formStyles.select}
        required
        disabled={turmas.length === 0}
      >
        <option value="">{turmas.length === 0 ? 'Nenhuma turma disponível' : 'Selecione a turma'}</option>
        {turmas.map(t => (
          <option key={t.id} value={t.id}>{t.nome}</option>
        ))}
      </select>

      <select
        value={alunoSelecionado}
        onChange={e => setAlunoSelecionado(e.target.value)}
        style={formStyles.select}
        required
        disabled={alunos.length === 0}
      >
        <option value="">{alunos.length === 0 ? 'Nenhum aluno disponível' : 'Selecione o aluno'}</option>
        {alunos.map(a => (
          <option key={a.matricula} value={a.matricula}>
            {a.nome} (Matrícula: {a.matricula})
          </option>
        ))}
      </select>

      <select
        value={exame}
        onChange={e => setExame(e.target.value)}
        style={formStyles.select}
        required
      >
        <option value="">Selecione o tipo de avaliação</option>
        <option value="trabalho - av1">Trabalho - AV1</option>
        <option value="prova - av1">Prova - AV1</option>
        <option value="trabalho - av2">Trabalho - AV2</option>
        <option value="prova - av2">Prova - AV2</option>
      </select>

      <input
        type="number"
        step="0.01"
        placeholder="Nota"
        value={nota}
        onChange={e => setNota(e.target.value)}
        style={formStyles.input}
        min="0"
        max="10"
        required
      />

      <button type="submit" style={formStyles.button}>Salvar Nota</button>
    </form>
  );
}

export function InserirFaltas() {
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);

  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [faltas, setFaltas] = useState('');
  const [tipo, setTipo] = useState(''); 

  useEffect(() => {
    async function fetchCursos() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) return;

      try {
        const res = await fetch(`http://localhost:3001/api/cursos/professor?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setCursos(data);
      } catch (err) {
        console.error('Erro ao buscar cursos:', err);
      }
    }

    async function fetchPeriodos() {
      try {
        const res = await fetch('http://localhost:3001/api/periodos');
        const data = await res.json();
        setPeriodos(data);
      } catch (err) {
        console.error('Erro ao buscar períodos:', err);
      }
    }

    fetchCursos();
    fetchPeriodos();
  }, []);

  useEffect(() => {
    async function fetchTurmas() {
      if (!cursoSelecionado || !periodoSelecionado) return;

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) return;

      try {
        const res = await fetch(`http://localhost:3001/api/turmas?curso=${cursoSelecionado}&periodo=${periodoSelecionado}&email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setTurmas(data);
      } catch (err) {
        console.error('Erro ao buscar turmas:', err);
        setTurmas([]);
      }

      setTurmaSelecionada('');
      setAlunos([]);
      setAlunoSelecionado('');
    }

    fetchTurmas();
  }, [cursoSelecionado, periodoSelecionado]);

  useEffect(() => {
    async function fetchAlunos() {
      if (!turmaSelecionada) return;

      try {
        const res = await fetch(`http://localhost:3001/api/turmas/${turmaSelecionada}/alunos`);
        const data = await res.json();
        setAlunos(data);
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        setAlunos([]);
      }

      setAlunoSelecionado('');
    }

    fetchAlunos();
  }, [turmaSelecionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cursoSelecionado || !periodoSelecionado || !turmaSelecionada || !alunoSelecionado || !tipo) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (faltas === '') {
      alert('Informe o número de faltas.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/faltas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_aluno: alunoSelecionado, 
          id_turma: turmaSelecionada,
          falta: parseInt(faltas),
          tipo,  
        }),
      });

      if (response.ok) {
        alert('Faltas cadastradas com sucesso!');
        setCursoSelecionado('');
        setPeriodoSelecionado('');
        setTurmaSelecionada('');
        setAlunoSelecionado('');
        setFaltas('');
        setTipo('');
        setTurmas([]);
        setAlunos([]);
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      <h2 style={formStyles.title}>Inserir Faltas</h2>

      <select
        value={cursoSelecionado}
        onChange={e => setCursoSelecionado(e.target.value)}
        style={formStyles.select}
        required
      >
        <option value="">Selecione o curso</option>
        {cursos.map(c => (
          <option key={c.id} value={c.id}>{c.nome}</option>
        ))}
      </select>

      <select
        value={periodoSelecionado}
        onChange={e => setPeriodoSelecionado(e.target.value)}
        style={formStyles.select}
        required
      >
        <option value="">Selecione o período</option>
        {periodos.map(p => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>

      <select
        value={turmaSelecionada}
        onChange={e => setTurmaSelecionada(e.target.value)}
        style={formStyles.select}
        required
        disabled={turmas.length === 0}
      >
        <option value="">{turmas.length === 0 ? 'Nenhuma turma disponível' : 'Selecione a turma'}</option>
        {turmas.map(t => (
          <option key={t.id} value={t.id}>{t.nome}</option>
        ))}
      </select>

      <select
        value={alunoSelecionado}
        onChange={e => setAlunoSelecionado(e.target.value)}
        style={formStyles.select}
        required
        disabled={alunos.length === 0}
      >
        <option value="">{alunos.length === 0 ? 'Nenhum aluno disponível' : 'Selecione o aluno'}</option>
        {alunos.map(a => (
          <option key={a.matricula} value={a.matricula}>
            {a.nome} (Matrícula: {a.matricula})
          </option>
        ))}
      </select>

      <select
        value={tipo}
        onChange={e => setTipo(e.target.value)}
        style={formStyles.select}
        required
      >
        <option value="">Selecione o tipo de falta</option>
        <option value="justificada">Justificada</option>
        <option value="não justificada">Não Justificada</option>
      </select>

      <input
        type="number"
        placeholder="Quantidade de faltas"
        value={faltas}
        onChange={e => setFaltas(e.target.value)}
        style={formStyles.input}
        min="0"
        required
      />

      <button type="submit" style={formStyles.button}>Salvar Faltas</button>
    </form>
  );
}

export function AlterarCadastro() {
  const [matricula, setMatricula] = useState('');
  const [aluno, setAluno] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');

  const buscarAluno = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/alunos/${matricula}`);
      if (!res.ok) {
        alert('Aluno não encontrado.');
        setAluno(null);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setAluno(data);
      setNome(data.nome);
      setCpf(data.cpf);
      setLogradouro(data.logradouro);
      setNumero(data.numero);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar aluno.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aluno) return;

    try {
      const res = await fetch(`http://localhost:3001/api/alunos/${matricula}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          cpf,
          logradouro,
          numero
        }),
      });

      if (res.ok) {
        alert('Cadastro atualizado com sucesso!');
      } else {
        const error = await res.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      <h2 style={formStyles.title}>Alterar Cadastro</h2>

      <input
        type="text"
        placeholder="Matrícula"
        value={matricula}
        onChange={e => setMatricula(e.target.value)}
        style={formStyles.input}
        required
      />
      <button
        type="button"
        onClick={buscarAluno}
        style={{ ...formStyles.button, backgroundColor: '#28a745' }}
        disabled={isLoading}
      >
        {isLoading ? 'Buscando...' : 'Buscar Aluno'}
      </button>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        style={{ ...formStyles.input, marginTop: '20px'}}
        disabled={!aluno}
        required
      />

      <input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={e => setCpf(e.target.value)}
        style={formStyles.input}
        disabled={!aluno}
        required
      />

      <input
        type="text"
        placeholder="Logradouro"
        value={logradouro}
        onChange={e => setLogradouro(e.target.value)}
        style={formStyles.input}
        disabled={!aluno}
        required
      />

      <input
        type="number"
        placeholder="Número"
        value={numero}
        onChange={e => setNumero(e.target.value)}
        style={formStyles.input}
        disabled={!aluno}
        required
      />

      <button
        type="submit"
        style={formStyles.button}
        disabled={!aluno}
      >
        Salvar Alterações
      </button>
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
