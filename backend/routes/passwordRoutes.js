const express = require('express');
const router = express.Router();

const passwordController = require('../controllers/passwordController');

router.post('/redefinir-senha', passwordController.redefinirSenha);

module.exports = router;
