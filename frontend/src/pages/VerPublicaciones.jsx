import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../api.js';

export default function VerPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const data = await postsApi.obtenerTodo();
      setPublicaciones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="contenedor">
      <div className="encabezado">
        <h2>Publicaciones</h2>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>

      {error && (
        <div>
          <p>{error}</p>
          <button onClick={cargar}>Reintentar</button>
        </div>
      )}

      {cargando ? (
        <p>Cargando publicaciones…</p>
      ) : publicaciones.length === 0 ? (
        <p>No hay publicaciones todavía.</p>
      ) : (
        publicaciones.map((pub) => (
          <div key={pub.id} className="publicacion">
            <p className="autor">{pub.autor}</p>
            <p>{pub.contenido}</p>
          </div>
        ))
      )}
    </div>
  );
}
