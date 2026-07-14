const Report = require('../models/Report');

exports.criarDenuncia = async (req, res) => {
    try {
        const { targetId, targetType, reason, description, evidences } = req.body;
        // Simulando ID do usuário logado por enquanto
        const reporterId = 'user-123'; 

        const novaDenuncia = new Report({
            reporterId,
            targetId,
            targetType,
            reason,
            description,
            evidences
        });

        // No futuro, aqui salva no MongoDB: await novaDenuncia.save();
        
        res.status(201).json({
            success: true,
            message: 'Denúncia enviada com sucesso para nossa equipe de moderação.',
            data: novaDenuncia
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao enviar denúncia.', error: error.message });
    }
};

exports.listarDenuncias = async (req, res) => {
    try {
        // No futuro, aqui busca do MongoDB: const denuncias = await Report.find();
        
        // Mock data para o Dashboard
        const denuncias = [
            {
                _id: 'rep-1',
                targetType: 'User',
                targetId: 'user-99',
                reason: 'Perfil falso',
                status: 'Recebida',
                createdAt: new Date()
            },
            {
                _id: 'rep-2',
                targetType: 'Institution',
                targetId: 'inst-2',
                reason: 'Maus serviços',
                status: 'Em análise',
                createdAt: new Date(Date.now() - 86400000)
            }
        ];

        res.status(200).json({ success: true, data: denuncias });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao listar denúncias.', error: error.message });
    }
};
