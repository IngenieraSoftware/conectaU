import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api.js';
import { nombreEsValido, emailEsValido, passwordEsSegura } from '../validators.js';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMensaje('');

    const nombreLimpio = nombre.trim();
    const emailLimpio = email.trim();

    if (!nombreEsValido(nombreLimpio)) {
      setError('El nombre de usuario debe tener entre 3 y 30 caracteres.');
      return;
    }
    if (!emailEsValido(emailLimpio)) {
      setError('Ingresa un correo válido que termine en @gmail.com.');
      return;
    }
    if (!passwordEsSegura(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, con letras y números.');
      return;
    }

    setCargando(true);
    try {
      const data = await authApi.registrar({ nombre: nombreLimpio, email: emailLimpio, password });
      if (data.session) {
        // Confirmación de correo desactivada: la cuenta ya quedó autenticada,
        // vamos directo a la página principal (tal como pide la HU).
        navigate('/');
      } else {
        // El proyecto de Supabase del equipo tiene la confirmación de correo activada.
        setMensaje('Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="contenedor">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={cargando}>{cargando ? 'Creando cuenta...' : 'Registrarme'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      {mensaje && <p>{mensaje}</p>}
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
}