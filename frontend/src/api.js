import { supabase } from './supabaseClient.js';
import bcrypt from 'bcryptjs';

function guardarSesion(usuario) {
  localStorage.setItem('usuario_sesion', JSON.stringify(usuario));
  window.dispatchEvent(new Event('sesion-cambio'));
}

export const authApi = {
  async registrar({ nombre, email, password }) {
    const { data: existente } = await supabase.from('usuario').select('id').eq('email', email).maybeSingle();
    if (existente) throw new Error('Ese email ya está registrado');

    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('usuario')
      .insert({ nombre, email, contraseña: hash })
      .select('id, nombre, email')
      .single();
    if (error) throw new Error(error.message);

    guardarSesion(data);
    return data;
  },

  async login({ email, password }) {
    const { data, error } = await supabase
      .from('usuario')
      .select('id, nombre, email, contraseña')
      .eq('email', email)
      .maybeSingle();
    if (error) throw new Error(error.message);

    const coincide = data && await bcrypt.compare(password, data.contraseña);
    if (!coincide) throw new Error('Credenciales inválidas');

    const usuario = { id: data.id, nombre: data.nombre, email: data.email };
    guardarSesion(usuario);
    return usuario;
  },

  async logout() {
    localStorage.removeItem('usuario_sesion');
    window.dispatchEvent(new Event('sesion-cambio'));
  },

  async usuarioActual() {
    const guardado = localStorage.getItem('usuario_sesion');
    return guardado ? JSON.parse(guardado) : null;
  },
};

export const postsApi = {
  async obtener() {
    const { data: publicaciones, error } = await supabase
      .from('publicacion')
      .select('id, descripcion, usuario_id, usuario(nombre)')
      .eq('estado', true)
      .order('id', { ascending: false });
    if (error) throw new Error(error.message);

    const { data: comentarios, error: error2 } = await supabase
      .from('comentario')
      .select('id, publicacion_id, texto, usuario(nombre)')
      .eq('estado', true)
      .order('id', { ascending: true });
    if (error2) throw new Error(error2.message);

    return publicaciones.map((pub) => ({
      id: pub.id,
      contenido: pub.descripcion,
      autor: pub.usuario?.nombre,
      autor_id: pub.usuario_id,
      respuestas: comentarios
        .filter((c) => c.publicacion_id === pub.id)
        .map((c) => ({ id: c.id, contenido: c.texto, autor: c.usuario?.nombre, autor_id: c.usuario_id })),
    }));
  },

  async crear(texto) {
    const usuario = await authApi.usuarioActual();
    if (!usuario) throw new Error('Debes iniciar sesión');
    const { data, error } = await supabase
      .from('publicacion')
      .insert({ usuario_id: usuario.id, titulo: texto.slice(0, 40), descripcion: texto, estado: true })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async borrar(id) {
    const { error } = await supabase.from('publicacion').update({ estado: false }).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async borrarComentario(id) {
    const { error } = await supabase.from('comentario').update({ estado: false }).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async responder(publicacionId, texto) {
    const usuario = await authApi.usuarioActual();
    if (!usuario) throw new Error('Debes iniciar sesión');
    const { data, error } = await supabase
      .from('comentario')
      .insert({ publicacion_id: publicacionId, usuario_id: usuario.id, texto, estado: true })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};