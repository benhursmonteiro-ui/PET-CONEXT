import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Fix for default marker icons in Leaflet + React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapaInstituicoes = () => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Foco inicial em São Paulo, por exemplo
  const position = [-23.55052, -46.633308];

  useEffect(() => {
    const fetchInstituicoes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/instituicoes?tipo=Todas');
        setInstituicoes(res.data.data);
      } catch (err) {
        console.error("Erro ao buscar coordenadas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstituicoes();
  }, []);

  if (loading) return <div style={{ padding: '32px' }}>Carregando mapa...</div>;

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <MapContainer center={position} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {instituicoes.map(inst => (
          inst.coordenadas && inst.coordenadas.lat && inst.coordenadas.lng && (
            <Marker key={inst._id} position={[inst.coordenadas.lat, inst.coordenadas.lng]}>
              <Popup>
                <strong>{inst.nome}</strong><br/>
                {inst.tipo}<br/>
                <Link to={`/instituicoes/${inst._id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Ver Perfil</Link>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaInstituicoes;
