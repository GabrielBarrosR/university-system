const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');


router.post('/', alunoController.cadastrarAluno);
router.get('/matricula/:email', alunoController.consultarMatricula);
router.get('/:matricula', alunoController.buscarAluno)
router.put("/cancelar-matricula", alunoController.cancelarMatricula);
router.put('/:matricula', alunoController.atualizarAluno)


module.exports = router;
