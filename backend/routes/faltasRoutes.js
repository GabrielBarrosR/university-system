const express = require('express');
const router = express.Router();
const { inserirFalta } = require('../controllers/faltasController');

router.post('/', inserirFalta);

module.exports = router;
