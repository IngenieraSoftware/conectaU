import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function inicialDe(nombre) {
  return (nombre || '?').trim().charAt(0).toUpperCase();
}

export default function VerPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="vp-pagina">
      <header className="vp-encabezado">
        <div>
          <p className="vp-eyebrow">ConectaU</p>
          <h2 className="vp-titulo-pagina">Publicaciones</h2>
        </div>
        <button className="vp-btn" onClick={() => navigate('/')}>
          Volver
        </button>
      </header>

      {cargando && <p className="vp-estado">Cargando publicaciones…</p>}

      {!cargando && error && (
        <div className="vp-estado vp-error">
          <p>No se pudieron cargar las publicaciones.</p>
          <p className="vp-error-detalle">{error}</p>
          <button className="vp-btn" onClick={cargarPublicaciones}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && publicaciones.length === 0 && (
        <p className="vp-estado">Todavía no hay nada publicado. Sé el primero en compartir algo.</p>
      )}

      {!cargando && !error && publicaciones.length > 0 && (
        <div className="vp-lista">
          {publicaciones.map((pub) => (
            <article key={pub.id} className="vp-tarjeta">
              <div className="vp-avatar" aria-hidden="true">
                {inicialDe(pub.autor)}
              </div>
              <div className="vp-tarjeta-cuerpo">
                <header className="vp-tarjeta-header">
                  <span className="vp-autor">{pub.autor}</span>
                  <time className="vp-fecha" dateTime={pub.fecha}>
                    {formatearFecha(pub.fecha)}
                  </time>
                </header>
                {pub.titulo && <h3 className="vp-titulo">{pub.titulo}</h3>}
                <p className="vp-contenido">{pub.contenido}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}