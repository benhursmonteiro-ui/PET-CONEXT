import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardInstituicao from '../../components/CardInstituicao/CardInstituicao';

const InstituicoesHome = () => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [filtro, setFiltro] = useState('Todas');
  const [loading, setLoading] = useState(true);

  const categorias = ['Todas', 'ONG', 'Clinica', 'PetShop', 'Adestrador'];

  useEffect(() => {
    const fetchInstituicoes = async () => {
      setLoading(true);
      try {
        // Conecta na API real (mock ou DB)
        const res = await axios.get(`http://localhost:5000/api/instituicoes?tipo=${filtro}`);
        setInstituicoes(res.data.data);
      } catch (error) {
        console.error("Erro ao buscar instituições", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstituicoes();
  }, [filtro]);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Instituições Pet 🏥🐾</h1>
        <p style={{ color: '#6b7280' }}>Descubra ONGs, Clínicas, Pet Shops e especialistas perto de você.</p>
      </header>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: filtro === cat ? 'var(--primary)' : '#e5e7eb',
              color: filtro === cat ? '#fff' : '#374151',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Cards */}
      {loading ? (
        <p>Carregando instituições...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {instituicoes.length > 0 ? (
            instituicoes.map(inst => (
              <CardInstituicao key={inst._id} instituicao={inst} />
            ))
          ) : (
            <p>Nenhuma instituição encontrada para esta categoria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InstituicoesHome;
