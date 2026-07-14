import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SeloVerificacao from '../../components/SeloVerificacao/SeloVerificacao';

const PerfilInstituicao = () => {
  const { id } = useParams();
  const [inst, setInst] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('Sobre');

  useEffect(() => {
    const fetchInstituicao = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/instituicoes/${id}`);
        setInst(res.data.data);
      } catch (err) {
        console.error("Erro", err);
      }
    };
    fetchInstituicao();
  }, [id]);

  if (!inst) return <div style={{ padding: '32px', textAlign: 'center' }}>Carregando perfil...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px' }}>
      {/* Header Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
        <img 
          src={inst.imagemPerfil} 
          alt={inst.nome} 
          style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover' }} 
        />
        <div>
          <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center' }}>
            {inst.nome} <SeloVerificacao tipoSelo={inst.selo} />
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            📍 {inst.localizacao.cidade}, {inst.localizacao.estado} • ⭐️ {inst.avaliacoes.notaMedia} / 5.0
          </p>
        </div>
      </div>

      {/* Navegação de Abas */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #e5e7eb', marginBottom: '24px' }}>
        {['Sobre', 'Serviços', 'Avaliações', 'Publicações'].map(aba => (
          <button 
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: abaAtiva === aba ? 'var(--primary)' : '#6b7280',
              borderBottom: abaAtiva === aba ? '3px solid var(--primary)' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            {aba}
          </button>
        ))}
      </div>

      {/* Conteúdo Dinâmico */}
      <div style={{ padding: '16px 0' }}>
        {abaAtiva === 'Sobre' && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Sobre a Instituição</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#374151' }}>{inst.descricao}</p>
            <div style={{ marginTop: '24px' }}>
              <strong>Endereço:</strong> {inst.localizacao.endereco}
            </div>
          </div>
        )}

        {abaAtiva === 'Serviços' && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Serviços Oferecidos</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {inst.servicos.map((svc, i) => (
                <li key={i} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{svc.nome}</h3>
                    {svc.descricao && <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>{svc.descricao}</p>}
                  </div>
                  {svc.preco && <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>R$ {svc.preco}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {abaAtiva === 'Avaliações' && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Avaliações dos Usuários</h2>
            {inst.avaliacoes.comentarios.map((av, i) => (
              <div key={i} style={{ padding: '16px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong>{av.usuario}</strong>
                  <span style={{ color: '#f59e0b' }}>{'⭐️'.repeat(av.nota)}</span>
                </div>
                <p style={{ margin: 0 }}>{av.texto}</p>
              </div>
            ))}
          </div>
        )}

        {abaAtiva === 'Publicações' && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Mídia e Atualizações</h2>
            <p>Nenhuma publicação recente. Em breve!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilInstituicao;
