import React from 'react';
import AppRoutes from './routes/AppRoutes';
import BotaoSosPet from './components/BotaoSosPet/BotaoSosPet';
import './styles/global.css';

function App() {
  return (
    <div className="app-container">
      <AppRoutes />
      <BotaoSosPet />
    </div>
  );
}

export default App;
