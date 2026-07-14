import React from 'react';

const SeloVerificacao = ({ tipoSelo }) => {
  let color = '#9ca3af'; // default gray
  let icon = '✓';
  let title = 'Verificado';

  switch (tipoSelo) {
    case 'Verificada':
      color = '#22c55e'; // Green
      title = 'Instituição Verificada';
      break;
    case 'ClinicaCertificada':
      color = '#3b82f6'; // Blue
      title = 'Clínica Veterinária Certificada';
      icon = '🏥';
      break;
    case 'ONGParceira':
      color = '#f97316'; // Orange
      title = 'ONG Parceira';
      icon = '🧡';
      break;
    case 'ParceiroPremium':
      color = '#a855f7'; // Purple
      title = 'Parceiro Premium';
      icon = '⭐';
      break;
    default:
      return null;
  }

  return (
    <span 
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color,
        color: '#fff',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        fontSize: '12px',
        marginLeft: '8px',
        cursor: 'help'
      }}
    >
      {icon}
    </span>
  );
};

export default SeloVerificacao;
