import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Feed from './pages/Feed.jsx';

function useSesion() {
  const [sesion, setSesion] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      setSesion(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return sesion;
}

export default function App() {
  const sesion = useSesion();

  if (sesion === undefined) return <p>Cargando...</p>;

  return (
    <Routes>
      <Route path="/login" element={sesion ? <Navigate to="/" /> : <Login />} />
      <Route path="/registro" element={sesion ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={sesion ? <Feed /> : <Navigate to="/login" />} />
    </Routes>
  );
}
