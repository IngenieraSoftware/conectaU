import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Feed from './pages/Feed.jsx';

function haySesion() {
  return !!localStorage.getItem('usuario_sesion');
}

export default function App() {
  const [sesion, setSesion] = useState(haySesion());

  useEffect(() => {
    function actualizar() { setSesion(haySesion()); }
    window.addEventListener('sesion-cambio', actualizar);
    return () => window.removeEventListener('sesion-cambio', actualizar);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={sesion ? <Navigate to="/" /> : <Login />} />
      <Route path="/registro" element={sesion ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={sesion ? <Feed /> : <Navigate to="/login" />} />
    </Routes>
  );
}