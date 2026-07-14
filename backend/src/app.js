const express = require('express');
const cors = require('cors');
const path = require('path');

// Rotas (serão importadas aqui)
// const authRoutes = require('./routes/authRoutes');
// const petRoutes = require('./routes/petRoutes');

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos de upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Registrar Rotas
// app.use('/api/auth', authRoutes);
// app.use('/api/pets', petRoutes);
const instituicaoRoutes = require('./routes/instituicaoRoutes');
app.use('/api/instituicoes', instituicaoRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

// Rota de Teste Base
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'PetConnect API rodando com sucesso!' });
});

// Tratamento de Erro Global (Middlewares de Erro iriam aqui)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor', message: err.message });
});

module.exports = app;
