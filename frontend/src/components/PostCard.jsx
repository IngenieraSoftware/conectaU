import { useState } from 'react';
import { postsApi } from '../api.js';
import ReplyForm from './ReplyForm.jsx';

export default function PostCard({ publicacion, usuarioActual, onActualizar }) {
  const [mostrarRespuestas, setMostrarRespuestas] = useState(false);

  async function handleBorrar() {
    await postsApi.borrar(publicacion.id);
    onActualizar();
  }

  const esAutor = usuarioActual && usuarioActual.id === publicacion.autor_id;
  const inicial = (publicacion.autor || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="publicacion">
      <div className="avatar">{inicial}</div>
      <div className="publicacion-cuerpo">
        <p className="autor">{publicacion.autor}</p>
        <p>{publicacion.contenido}</p>

        <div className="acciones">
          <button className="accion-boton" onClick={() => setMostrarRespuestas(!mostrarRespuestas)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            {publicacion.respuestas.length}
          </button>
          {esAutor && (
            <button className="accion-boton borrar" onClick={handleBorrar}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
              </svg>
              Borrar
            </button>
          )}
        </div>
        
        {mostrarRespuestas && (
          <div className="respuestas">
            {publicacion.respuestas.map((r) => (
              <div key={r.id} className="respuesta-item">
                <span><strong>{r.autor}:</strong> {r.contenido}</span>
                {usuarioActual && usuarioActual.id === r.autor_id && (
                  <button
                    className="accion-boton borrar"
                    onClick={async () => { await postsApi.borrarComentario(r.id); onActualizar(); }}
                  >
                    Borrar
                  </button>
                )}
              </div>
            ))}
            <ReplyForm publicacionId={publicacion.id} onRespondido={onActualizar} />
          </div>
        )}


      </div>
    </div>
  );
}