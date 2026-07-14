import React, { useState } from 'react';

const BotaoSosPet = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form States
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setType('');
    setLocation('');
    setDetails('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !location || !details) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId: location,
          targetType: 'User',
          reason: type,
          description: details,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setToastMessage('🚨 ALERTA SOS ENVIADO! Ocorrência registrada com sucesso.');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        handleClose();
      } else {
        alert('Erro ao enviar denúncia: ' + (data.message || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Erro de conexão ao enviar denúncia.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          backgroundColor: '#ef4444',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          padding: '16px 24px',
          fontSize: '1.15rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: isHovered 
            ? '0 20px 25px -5px rgba(239, 68, 68, 0.4), 0 10px 10px -5px rgba(239, 68, 68, 0.2)' 
            : '0 10px 15px -3px rgba(239, 68, 68, 0.3), 0 4px 6px -2px rgba(239, 68, 68, 0.1)',
          transform: isHovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 9999
        }}
      >
        <span style={{ fontSize: '1.4rem' }}>🚨</span>
        SOS Pet
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {/* Modal Card */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              width: '90%',
              maxWidth: '540px',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fff'
            }}>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 'bold',
                color: '#ef4444',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                <span>🚨</span> Emergência SOS Pet
              </h2>
              <button 
                onClick={handleClose}
                style={{
                  fontSize: '1.5rem',
                  color: '#94a3b8',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  lineHeight: 1
                }}
                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
              >
                &times;
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px', margin: 0 }}>
              {/* Type Select */}
              <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
                  Tipo de Ocorrência:
                </label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                >
                  <option value="">Selecione o problema...</option>
                  <option value="Animal de Rua">Animal em situação de rua 🐕</option>
                  <option value="Animal Perdido">Animal Perdido 🔍</option>
                  <option value="Animal Ferido">Animal Ferido 🩹</option>
                  <option value="Maus-tratos">Maus-tratos / Resgate Urgente 🚨</option>
                </select>
              </div>

              {/* Location Input */}
              <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
                  Localização (Endereço aproximado):
                </label>
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Onde o pet está?"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              {/* Details Textarea */}
              <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
                  Detalhes (Raça, cor, estado do animal):
                </label>
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Descreva a situação, raça aproximada, cor e estado do animal..."
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              {/* Footer Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '16px',
                marginTop: '16px'
              }}>
                <button 
                  type="button" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, transform 0.1s',
                    boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                >
                  {isSubmitting ? 'Enviando...' : 'Emitir Alerta SOS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '32px',
          backgroundColor: '#fffbeb',
          borderLeft: '5px solid #f59e0b',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 100001,
          animation: 'slideInRight 0.3s ease-out',
          maxWidth: '380px',
          borderTop: '1px solid #fef3c7',
          borderRight: '1px solid #fef3c7',
          borderBottom: '1px solid #fef3c7'
        }}>
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#78350f' }}>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Keyframe animation definitions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default BotaoSosPet;

