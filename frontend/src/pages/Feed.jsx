import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, postsApi } from '../api.js';
import PostCard from '../components/PostCard.jsx';

export default function Feed() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [contenido, setContenido] = useState('');
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
    if (!contenido.trim()) return;
    await postsApi.crear(contenido);
    setContenido('');
    cargar();
  }

  async function handleLogout() {
    await authApi.logout();
    navigate('/login');
  }

  return (
    <div className="contenedor">
      <div className="encabezado">
        <h2>Feed</h2>
        <button onClick={() => navigate('/publicaciones')}>Ver publicaciones</button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <form onSubmit={handlePublicar}>
        <textarea
          placeholder="¿Qué quieres compartir?"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />
        <button type="submit">Publicar</button>
      </form>

      {publicaciones.map((pub) => (
        <PostCard key={pub.id} publicacion={pub} usuarioActual={usuario} onActualizar={cargar} />
      ))}
    </div>
  );
}
