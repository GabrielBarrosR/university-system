import { useState, useEffect } from 'react';


export function ConsultarNotas() {
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    async function buscarNotas() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email) return;

        const res = await fetch(`http://localhost:3001/api/avaliacoes/${user.email}/notas`);
        if (!res.ok) {
          console.error('Erro na resposta da API:', res.statusText);
          return;
        }
        const data = await res.json();
        setNotas(data);
      } catch (error) {
        console.error('Erro ao buscar notas:', error);
      }
    }

    buscarNotas();
  }, []);

  const agrupado = {};
  notas.forEach(nota => {
    if (!agrupado[nota.disciplina]) {
      agrupado[nota.disciplina] = { soma: 0, qtd: 0 };
    }
    agrupado[nota.disciplina].soma += Number(nota.nota);
    agrupado[nota.disciplina].qtd += 1;
  });

  const mediasCalculadas = Object.entries(agrupado).map(([disciplina, { soma, qtd }]) => ({
    disciplina,
    media: soma / qtd,
    qtd
  }));

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Consultar Notas</h2>
      {notas.length !== 0 ? (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Disciplina</th>
              <th style={styles.headerCell}>Nota</th>
              <th style={styles.headerCell}>Notas Lançadas</th>
              <th style={styles.headerCell}>Situação</th>
            </tr>
          </thead>
          <tbody>
            {mediasCalculadas.map((item, index) => (
              <tr key={index} style={styles.row}>
                <td style={styles.cell}>{item.disciplina}</td>
                <td style={styles.cell}>{item.media.toFixed(2)}</td>
                <td style={styles.cell}>{item.qtd + "/4"}</td>
                <td style={styles.cell}>
                  <span style={item.media >= 6 ? styles.aprovado : styles.reprovado}>
                    {item.media >= 6 ? "Aprovado" : "Reprovado"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma nota encontrada.</p>
      )}
    </div>
  );
}

export function ConsultarFaltas() {
  const [faltas, setFaltas] = useState([]);

  useEffect(() => {
    async function buscarFaltas() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email) return;

        const res = await fetch(`http://localhost:3001/api/faltas/${user.email}`);
        if (!res.ok) {
          console.error('Erro na resposta da API:', res.statusText);
          return;
        }
        const data = await res.json();
        setFaltas(data);
      } catch (error) {
        console.error('Erro ao buscar faltas:', error);
      }
    }

    buscarFaltas();
  }, []);

  const agrupado = {};

  faltas.forEach(({ disciplina, tipo, falta }) => {
    if (!agrupado[disciplina]) {
      agrupado[disciplina] = {
        totalFaltas: 0,
        justificadas: 0,
        naoJustificadas: 0,
      };
    }

    agrupado[disciplina].totalFaltas += Number(falta);

    const tipoNormalizado = (tipo || '').toLowerCase().trim();

    if (tipoNormalizado === 'justificada') {
      agrupado[disciplina].justificadas += Number(falta);
    } else if (tipoNormalizado === 'não justificada' || tipoNormalizado === 'nao justificada') {
      agrupado[disciplina].naoJustificadas += Number(falta);
    }
  });

  const faltasAgrupadas = Object.entries(agrupado).map(([disciplina, valores]) => ({
    disciplina,
    ...valores,
  }));

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Consultar Faltas</h2>
      {faltas.length !== 0 ? (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Disciplina</th>
              <th style={styles.headerCell}>Faltas</th>
              <th style={styles.headerCell}>Justificadas</th>
              <th style={styles.headerCell}>Não Justificadas</th>
            </tr>
          </thead>
          <tbody>
            {faltasAgrupadas.map((item, index) => (
              <tr key={index} style={styles.row}>
                <td style={styles.cell}>{item.disciplina}</td>
                <td style={styles.cell}>{item.totalFaltas}</td>
                <td style={styles.cell}>{item.justificadas}</td>
                <td style={styles.cell}>{item.naoJustificadas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma falta encontrada.</p>
      )}
    </div>
  );
}

export function CancelarMatricula() {
  const [aluno, setAluno] = useState(null);
  const [showPopup, setShowPopup] = useState(false); 

  useEffect(() => {
    async function consultarDados() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email) return;

        const matriculaRes = await fetch(
          `http://localhost:3001/api/alunos/matricula/${user.email}`
        );
        if (!matriculaRes.ok) {
          console.error("Erro ao consultar matrícula:", matriculaRes.statusText);
          return;
        }
        const { matricula } = await matriculaRes.json();

        const alunoRes = await fetch(`http://localhost:3001/api/alunos/${matricula}`);
        if (!alunoRes.ok) {
          console.error("Erro ao consultar dados do aluno:", alunoRes.statusText);
          return;
        }

        const alunoData = await alunoRes.json();
        setAluno(alunoData);
      } catch (error) {
        console.error("Erro ao consultar dados do aluno:", error);
      }
    }
    consultarDados();
  }, []);

  async function handleCancel() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) return;

      const res = await fetch(`http://localhost:3001/api/alunos/cancelar-matricula`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, userType: user.tipo }),
      });

      if (!res.ok) {
        console.error("Erro na resposta da API:", res.statusText);
        return;
      }

      const data = await res.json();
      alert(data.message || "Matrícula cancelada com sucesso");
      localStorage.removeItem("user");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  if (!aluno) return <p>Carregando dados...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dados da Matrícula</h2>
      <table style={styles.table}>
        <tbody>
          <tr style={styles.row}>
            <td style={{ ...styles.cell, fontWeight: "bold", fontSize: "20px" }}>Matrícula</td>
            <td style={styles.cell}>{aluno.matricula}</td>
          </tr>
          <tr style={styles.row}>
            <td style={{ ...styles.cell, fontWeight: "bold", fontSize: "20px" }}>Nome</td>
            <td style={styles.cell}>{aluno.nome}</td>
          </tr>
          <tr style={styles.row}>
            <td style={{ ...styles.cell, fontWeight: "bold", fontSize: "20px" }}>CPF</td>
            <td style={styles.cell}>{aluno.cpf}</td>
          </tr>
          <tr style={styles.row}>
            <td style={{ ...styles.cell, fontWeight: "bold", fontSize: "20px" }}>Logradouro</td>
            <td style={styles.cell}>{aluno.logradouro}</td>
          </tr>
          <tr style={styles.row}>
            <td style={{ ...styles.cell, fontWeight: "bold", fontSize: "20px" }}>Número</td>
            <td style={styles.cell}>{aluno.numero}</td>
          </tr>
        </tbody>
      </table>

      <button
        style={styles.cancelbutton}
        onClick={() => setShowPopup(true)} 
      >
        Desejo Cancelar a Matrícula
      </button>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              minWidth: "300px",
            }}
          >
            <h2>Confirmação</h2>
            <p>Você perderá acesso ao portal do aluno. Deseja confirmar?</p>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around" }}>
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleCancel();
                  setShowPopup(false);
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ff4c4c",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export function ConsultarGrade() {
  const [grade, setGrade] = useState([]);

  useEffect(() => {
    async function buscarGrade() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email) return;

        const res = await fetch(`http://localhost:3001/api/turmas/horarios/${user.email}`);
        if (!res.ok) {
          console.error('Erro na resposta da API:', res.statusText);
          return;
        }
        const data = await res.json();
        setGrade(data);
      } catch (error) {
        console.error('Erro ao buscar grade:', error);
      }
    }

    buscarGrade();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Grade de Horário</h2>
      {grade.length !== 0 ? (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Disciplina</th>
              <th style={styles.headerCell}>Dia da Semana</th>
              <th style={styles.headerCell}>Horário</th>
            </tr>
          </thead>
          <tbody>
            {grade.map((item, index) => (
              <tr key={index} style={styles.row}>
                <td style={styles.cell}>{item.nome}</td>
                <td style={styles.cell}>{item.diaSemana}</td>
                <td style={styles.cell}>{item.horario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma grade encontrada.</p>
      )}
    </div>
  );
}

export function VisualizarContratos() {
  return <p>  
    <div>
    <h1>Contrato de Prestação de Serviços Educacionais</h1>
    <p>
      Pelo presente instrumento particular, a Universidade XYZ, inscrita no
      CNPJ sob nº 00.000.000/0001-00, doravante denominada CONTRATADA, e o
      ALUNO, doravante denominado CONTRATANTE, celebram o presente contrato,
      que se regerá pelas cláusulas e condições seguintes:
    </p>

    <h2>Cláusula 1 - Objeto</h2>
    <p>
      O presente contrato tem como objeto a prestação de serviços educacionais
      referentes ao curso de graduação escolhido pelo CONTRATANTE, conforme
      matrícula efetuada junto à CONTRATADA.
    </p>

    <h2>Cláusula 2 - Duração</h2>
    <p>
      O contrato terá duração correspondente ao período letivo contratado,
      podendo ser renovado mediante novo acordo entre as partes.
    </p>

    <h2>Cláusula 3 - Obrigações da CONTRATADA</h2>
    <ul>
      <li>
        Oferecer o conteúdo programático do curso de acordo com o plano de
        ensino aprovado.
      </li>
      <li>
        Disponibilizar professores qualificados e infraestrutura mínima para o
        desenvolvimento das atividades acadêmicas.
      </li>
      <li>
        Emitir certificados e históricos escolares conforme desempenho do
        CONTRATANTE.
      </li>
    </ul>

    <h2>Cláusula 4 - Obrigações do CONTRATANTE</h2>
    <ul>
      <li>Efetuar o pagamento das mensalidades nas datas estabelecidas.</li>
      <li>
        Cumprir o regulamento interno da instituição e respeitar as normas
        disciplinares.
      </li>
      <li>
        Participar das aulas e atividades acadêmicas, presenciais ou online,
        conforme cronograma.
      </li>
    </ul>

    <h2>Cláusula 5 - Valor e Forma de Pagamento</h2>
    <p>
      O valor do curso será pago em parcelas mensais, de acordo com a tabela de
      preços vigente na data da matrícula, através de boleto bancário ou outro
      meio indicado pela CONTRATADA.
    </p>

    <h2>Cláusula 6 - Rescisão</h2>
    <p>
      O contrato poderá ser rescindido por qualquer das partes, mediante aviso
      prévio de 30 (trinta) dias, observadas as penalidades previstas no
      regulamento da instituição.
    </p>

    <h2>Cláusula 7 - Foro</h2>
    <p>
      Fica eleito o foro da comarca de [Cidade], com renúncia de qualquer outro,
      por mais privilegiado que seja, para dirimir dúvidas ou controvérsias
      decorrentes deste contrato.
    </p>

    <p>
      E, por estarem assim justos e contratados, firmam o presente instrumento
      em duas vias de igual teor.
    </p>
  </div>

  </p>;
}

export function ConsultarHistorico() {
  const [notas, setNotas] = useState([]);
  const [faltas, setFaltas] = useState([]);
  const [grade, setGrade] = useState([]);
  const [aluno, setAluno] = useState(null); 

  useEffect(() => {
    async function buscarDados() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email) return;

        const resMatricula = await fetch(
          `http://localhost:3001/api/alunos/matricula/${user.email}`
        );
        const matriculaData = resMatricula.ok ? await resMatricula.json() : null;
        const matricula = matriculaData?.matricula;
        if (!matricula) return;

        const resAluno = await fetch(
          `http://localhost:3001/api/alunos/${matricula}`
        );
        const alunoData = resAluno.ok ? await resAluno.json() : null;
        setAluno(alunoData);

        const resNotas = await fetch(
          `http://localhost:3001/api/avaliacoes/${user.email}/notas`
        );
        const notasData = resNotas.ok ? await resNotas.json() : [];

        const resFaltas = await fetch(
          `http://localhost:3001/api/faltas/${user.email}`
        );
        const faltasData = resFaltas.ok ? await resFaltas.json() : [];

        const resGrade = await fetch(
          `http://localhost:3001/api/turmas/horarios/${user.email}`
        );
        const gradeData = resGrade.ok ? await resGrade.json() : [];

        setNotas(notasData);
        setFaltas(faltasData);
        setGrade(gradeData);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
    }

    buscarDados();
  }, []);

  const medias = {};
  notas.forEach((nota) => {
    if (!medias[nota.disciplina]) {
      medias[nota.disciplina] = { soma: 0, qtd: 0 };
    }
    medias[nota.disciplina].soma += Number(nota.nota);
    medias[nota.disciplina].qtd += 1;
  });

  const faltasAgrupadas = {};
  faltas.forEach(({ disciplina, falta }) => {
    if (!faltasAgrupadas[disciplina]) {
      faltasAgrupadas[disciplina] = 0;
    }
    faltasAgrupadas[disciplina] += Number(falta);
  });

  const historico = grade.map((disc) => {
    const mediaFinal =
      medias[disc.nome]?.soma / (medias[disc.nome]?.qtd || 1) || 0;
    const totalFaltas = faltasAgrupadas[disc.nome] || 0;

    let situacao = "Aprovado";
    if (mediaFinal < 6) situacao = "Reprovado por nota";
    if (totalFaltas > 20) situacao = "Reprovado por falta";

    return {
      disciplina: disc.nome,
      periodo: disc.periodo || aluno?.id_periodo || "Não informado",
      mediaFinal,
      faltas: totalFaltas,
      situacao,
    };
  });

  const porPeriodo = {};
  historico.forEach((item) => {
    if (!porPeriodo[item.periodo]) porPeriodo[item.periodo] = [];
    porPeriodo[item.periodo].push(item);
  });

  const periodosOrdenados = Object.keys(porPeriodo).sort();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Histórico Escolar</h2>

      {historico.length === 0 && <p>Nenhum histórico encontrado.</p>}

      {periodosOrdenados.map((periodo) => (
        <div key={periodo} style={{ marginBottom: "30px" }}>
          <h3 style={{ textAlign: "center", color: "#555" }}>
            Período: {periodo}
          </h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.headerCell}>Disciplina</th>
                <th style={styles.headerCell}>Nota Final</th>
                <th style={styles.headerCell}>Faltas</th>
                <th style={styles.headerCell}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {porPeriodo[periodo].map((item, index) => (
                <tr key={index} style={styles.row}>
                  <td style={styles.cell}>{item.disciplina}</td>
                  <td style={styles.cell}>{item.mediaFinal.toFixed(2)}</td>
                  <td style={styles.cell}>{item.faltas}</td>
                  <td style={styles.cell}>
                    <span
                      style={
                        item.situacao.startsWith("Aprovado")
                          ? styles.aprovado
                          : styles.reprovado
                      }
                    >
                      {item.situacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#007bff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  headerCell: {
    padding: '12px',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
  },
  row: {
    borderBottom: '1px solid #ddd',
  },
  cell: {
    padding: '12px',
    textAlign: 'center',
  },
  aprovado: {
    color: 'green',
    fontWeight: 'bold',
  },
  reprovado: {
    color: 'red',
    fontWeight: 'bold',
  },
    cancelbutton: {
    marginTop: '20px',
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
  }
};
