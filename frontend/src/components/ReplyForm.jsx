import { useState } from 'react';
import { postsApi } from '../api.js';

export default function ReplyForm({ publicacionId, onRespondido }) {
  const [contenido, setContenido] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contenido.trim()) return;
    await postsApi.responder(publicacionId, contenido);
    setContenido('');
    onRespondido();
  }

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      <input
        placeholder="Escribe una respuesta..."
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />
      <button type="submit">Responder</button>
    </form>
  );
}
