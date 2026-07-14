import React from 'react';

const CardInstituicao = ({ instituicao }) => {
  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case 'ONG': return '#ef4444'; // Red
      case 'Clinica': return '#3b82f6'; // Blue
      case 'PetShop': return '#f59e0b'; // Amber
      default: return '#10b981'; // Green
    }
  };

  return (
    <div className="card-instituicao" style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ height: '150px', width: '100%', backgroundColor: '#f3f4f6', position: 'relative' }}>
        <img 
          src={instituicao.imagemPerfil} 
          alt={`Capa de ${instituicao.nome}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: getBadgeColor(instituicao.tipo), color: '#fff', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {instituicao.tipo}
        </span>
      </div>
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#1f2937' }}>{instituicao.nome}</h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {instituicao.descricao}
        </p>
        <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '16px' }}>
          📍 {instituicao.localizacao.cidade}, {instituicao.localizacao.estado}
        </div>
        <button style={{ width: '100%', padding: '10px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          Ver Perfil Completo
        </button>
      </div>
    </div>
  );
};

export default CardInstituicao;
