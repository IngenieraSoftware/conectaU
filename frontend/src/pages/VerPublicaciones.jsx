import { useEffect, useState } from 'react';
import { obtenerPublicaciones } from '../publicacionesService.js';
import './VerPublicaciones.css';

function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso);
  return fecha.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function VerPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  async function cargarPublicaciones() {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerPublicaciones();
      setPublicaciones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  if (cargando) {
    return <p className="vp-estado">Cargando publicaciones…</p>;
  }

  if (error) {
    return (
      <div className="vp-estado vp-error">
        <p>{error}</p>
        <button onClick={cargarPublicaciones}>Reintentar</button>
      </div>
    );
  }

  if (publicaciones.length === 0) {
    return <p className="vp-estado">No hay publicaciones todavía.</p>;
  }

  return (
    <div className="vp-lista">
      {publicaciones.map((pub) => (
        <article key={pub.id} className="vp-tarjeta">
          <header className="vp-tarjeta-header">
            <span className="vp-autor">{pub.autor}</span>
            <time className="vp-fecha" dateTime={pub.fecha}>
              {formatearFecha(pub.fecha)}
            </time>
          </header>
          {pub.titulo && <h3 className="vp-titulo">{pub.titulo}</h3>}
          <p className="vp-contenido">{pub.contenido}</p>
        </article>
      ))}
    </div>
  );
}