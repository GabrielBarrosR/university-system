const express = require('express');
const cors = require('cors');
const app = express();

const loginRoutes = require('./routes/loginRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const periodoRoutes = require('./routes/periodoRoutes');
const faltaRoutes = require('./routes/faltasRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/login', loginRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/periodos', periodoRoutes);
app.use('/api/faltas', faltaRoutes);


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
