import React from 'react';

export function ConsultarNotas() {
  const notas = [
    { disciplina: 'Matemática', nota: 8.5, situacao: 'Aprovado' },
    { disciplina: 'História', nota: 7.0, situacao: 'Aprovado' },
    { disciplina: 'Física', nota: 5.5, situacao: 'Reprovado' },
    { disciplina: 'Química', nota: 9.2, situacao: 'Aprovado' },
    { disciplina: 'Biologia', nota: 6.0, situacao: 'Aprovado' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Consultar Notas</h2>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>Disciplina</th>
            <th style={styles.headerCell}>Nota</th>
            <th style={styles.headerCell}>Situação</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota, index) => (
            <tr key={index} style={styles.row}>
              <td style={styles.cell}>{nota.disciplina}</td>
              <td style={styles.cell}>{nota.nota}</td>
              <td style={styles.cell}>
                <span style={nota.situacao === 'Aprovado' ? styles.aprovado : styles.reprovado}>
                  {nota.situacao}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ConsultarFaltas() {
  return <p>Aqui você consulta suas faltas.</p>;
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
