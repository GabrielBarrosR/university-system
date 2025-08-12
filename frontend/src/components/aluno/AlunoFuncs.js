import { useState, useEffect } from 'react';


export function ConsultarNotas() {
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    async function buscarNotas() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email) return;

        const res = await fetch(`http://localhost:3001/api/alunos/${user.email}/notas`);
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
  return <p>Aqui você pode cancelar sua matrícula.</p>;
}

export function ConsultarGrade() {
  return <p>Aqui você consulta sua grade de horários.</p>;
}

export function VisualizarContratos() {
  return <p>Aqui você visualiza seus contratos.</p>;
}

export function ConsultarHistorico() {
  return <p>Aqui você consulta seu histórico escolar.</p>;
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
};
