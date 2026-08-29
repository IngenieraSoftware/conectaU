import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api.js';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await authApi.registrar({ nombre, email, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="pantalla-auth">
      <div className="tarjeta-auth">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Registrarme</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}