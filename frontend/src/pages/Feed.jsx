import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, postsApi } from '../api.js';
import PostCard from '../components/PostCard.jsx';

export default function Feed() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorPublicar, setErrorPublicar] = useState('');
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  async function cargar() {
    const data = await postsApi.obtener();
    setPublicaciones(data);
  }

  useEffect(() => {
    authApi.usuarioActual().then(setUsuario);
    cargar();
  }, []);

  async function handlePublicar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    setErrorPublicar('');
    setEnviando(true);
    try {
      await postsApi.crear(texto);
      setTexto('');
      cargar();
    } catch (err) {
      setErrorPublicar(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function handleLogout() {
    await authApi.logout();
    navigate('/login');
  }

  const inicial = (usuario?.nombre || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="contenedor">
      <div className="encabezado">
        <h2>Feed</h2>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <form onSubmit={handlePublicar} className="tarjeta-publicar">
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="avatar">{inicial}</div>
          <div style={{ flex: 1 }}>
            <textarea
              placeholder="¿Qué está pasando?"
              value={texto}
              maxLength={280}
              onChange={(e) => setTexto(e.target.value)}
            />
            <div className="publicar-pie">
              <span className="contador">{texto.length}/280</span>
              <button type="submit" disabled={enviando || !texto.trim()}>
                {enviando ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
            {errorPublicar && <p className="error">{errorPublicar}</p>}
          </div>
        </div>
      </form>

      {publicaciones.map((pub) => (
        <PostCard key={pub.id} publicacion={pub} usuarioActual={usuario} onActualizar={cargar} />
      ))}
    </div>
  );
}