import { supabase } from './supabaseClient.js';

export async function obtenerPublicaciones() {
  const { data, error } = await supabase
    .from('publicacion')
    .select('id, titulo, descripcion, fecha, usuario_id, usuario:usuario_id(nombre)')
    .eq('estado', true)
    .order('fecha', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar las publicaciones: ${error.message}`);
  }

  return (data ?? []).map((pub) => ({
    id: pub.id,
    autor: pub.usuario?.nombre ?? 'Usuario desconocido',
    titulo: pub.titulo,
    contenido: pub.descripcion,
    fecha: pub.fecha,
  }));
}