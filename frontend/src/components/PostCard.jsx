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

  return (
    <div className="publicacion">
      <p className="autor">{publicacion.autor}</p>
      <p>{publicacion.contenido}</p>

      <div className="acciones">
        <button onClick={() => setMostrarRespuestas(!mostrarRespuestas)}>
          Respuestas ({publicacion.respuestas.length})
        </button>
        {esAutor && <button onClick={handleBorrar}>Borrar</button>}
      </div>

      {mostrarRespuestas && (
        <div className="respuestas">
          {publicacion.respuestas.map((r) => (
            <p key={r.id}><strong>{r.autor}:</strong> {r.contenido}</p>
          ))}
          <ReplyForm publicacionId={publicacion.id} onRespondido={onActualizar} />
        </div>
      )}
    </div>
  );
}
