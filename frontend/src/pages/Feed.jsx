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
  const [mostrarModal, setMostrarModal] = useState(false);
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
      setMostrarModal(false);
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
        <div className="avatar">{inicial}</div>
        <h2>ConectU</h2>
        <div className="encabezado-acciones">
          <button className="btn-publicar-header" onClick={() => setMostrarModal(true)}>
            Publicar
          </button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <div className="modal-encabezado">
              <h3>Crear publicación</h3>
              <button className="btn-cerrar-modal" onClick={() => setMostrarModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handlePublicar}>
              <div className="modal-cuerpo">
                <div className="avatar">{inicial}</div>
                <div className="modal-editor">
                  <textarea
                    placeholder="¿Qué está pasando?"
                    value={texto}
                    maxLength={280}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                  <div className="publicar-pie">
                    <span className="contador">{texto.length}/280</span>
                    <div className="modal-acciones-pie">
                      <button
                        type="button"
                        className="btn-cancelar"
                        onClick={() => setMostrarModal(false)}
                      >
                        Cancelar
                      </button>
                      <button type="submit" disabled={enviando || !texto.trim()}>
                        {enviando ? 'Publicando...' : 'Publicar'}
                      </button>
                    </div>
                  </div>
                  {errorPublicar && <p className="error">{errorPublicar}</p>}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {publicaciones.map((pub) => (
        <PostCard key={pub.id} publicacion={pub} usuarioActual={usuario} onActualizar={cargar} />
      ))}
    </div>
  );
}