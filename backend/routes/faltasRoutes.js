const express = require('express');
const router = express.Router();
const { inserirFalta, consultasFaltas } = require('../controllers/faltasController');

router.post('/', inserirFalta);
router.get('/:email', consultasFaltas)

module.exports = router;
