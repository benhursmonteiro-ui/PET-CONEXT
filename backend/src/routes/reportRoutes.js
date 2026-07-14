const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');

// Rotas Base: /api/reports
router.post('/', ReportController.criarDenuncia);
router.get('/', ReportController.listarDenuncias);

module.exports = router;
