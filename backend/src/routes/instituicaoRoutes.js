const express = require('express');
const router = express.Router();
const InstituicaoController = require('../controllers/InstituicaoController');

// Rotas Base: /api/instituicoes
router.get('/', InstituicaoController.listarInstituicoes);
router.get('/:id', InstituicaoController.buscarInstituicaoPorId);

module.exports = router;
