const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');


router.post('/', alunoController.cadastrarAluno);
router.get('/:matricula', alunoController.buscarAluno)
router.put('/:matricula', alunoController.atualizarAluno)

module.exports = router;
