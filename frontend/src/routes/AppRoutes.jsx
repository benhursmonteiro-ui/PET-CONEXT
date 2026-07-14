import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages (To be created)
// import Home from '../pages/Home';
// import Feed from '../pages/Feed';
import InstituicoesHome from '../pages/Instituicoes/InstituicoesHome';
import PerfilInstituicao from '../pages/PerfilInstituicao/PerfilInstituicao';
import MapaInstituicoes from '../pages/MapaInstituicoes/MapaInstituicoes';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Placeholder Routes */}
        <Route path="/" element={<div>PetConnect - Página Inicial (Home)</div>} />
        <Route path="/feed" element={<div>PetConnect - Feed Social</div>} />
        <Route path="/instituicoes" element={<InstituicoesHome />} />
        <Route path="/instituicoes/:id" element={<PerfilInstituicao />} />
        <Route path="/mapa" element={<MapaInstituicoes />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
