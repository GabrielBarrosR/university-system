const express = require('express');
const router = express.Router();
const { inserirAvaliacao, listarNotasPorAluno } = require('../controllers/avaliacaoController');

router.post('/', inserirAvaliacao);
router.get('/:email/notas', listarNotasPorAluno);

module.exports = router;
