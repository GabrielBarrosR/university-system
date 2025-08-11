const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');


router.post('/', alunoController.cadastrarAluno);
router.get('/:matricula', alunoController.buscarAluno)
router.put('/:matricula', alunoController.atualizarAluno)
router.get('/:email/notas', alunoController.listarNotasPorAluno);

module.exports = router;
