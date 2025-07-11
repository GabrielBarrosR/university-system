const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');

router.get('/:id/alunos', turmaController.listarAlunosPorTurma);

router.get('/', turmaController.listarTurmasPorCursoEPeriodo);

module.exports = router;
