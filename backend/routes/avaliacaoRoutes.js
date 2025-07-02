const express = require('express');
const router = express.Router();
const { inserirAvaliacao } = require('../controllers/avaliacaoController');

router.post('/', inserirAvaliacao);

module.exports = router;
