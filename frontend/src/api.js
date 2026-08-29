import { supabase } from './supabaseClient.js';

export const authApi = {
  async registrar({ nombre, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });
    if (error) throw new Error(error.message);
    return data;
  },

  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async usuarioActual() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
};

export const postsApi = {
  async obtenerTodo() {
    const { data: publicaciones, error } = await supabase
      .from('publicaciones')
      .select('id, contenido, creado_en, usuario_id')
      .order('creado_en', { ascending: false });
    if (error) throw new Error(error.message);

    const ids = [...new Set(publicaciones.map((p) => p.usuario_id))];
    const { data: perfiles, error: error2 } = await supabase
      .from('perfiles')
      .select('id, nombre')
      .in('id', ids);
    if (error2) throw new Error(error2.message);

    const nombrePorId = Object.fromEntries(perfiles.map((p) => [p.id, p.nombre]));

    return publicaciones.map((pub) => ({
      id: pub.id,
      contenido: pub.contenido,
      creado_en: pub.creado_en,
      autor: nombrePorId[pub.usuario_id] || 'Usuario',
    }));
  },

  async obtener() {
    const { data: publicaciones, error } = await supabase
      .from('publicaciones')
      .select('id, contenido, creado_en, usuario_id')
      .order('creado_en', { ascending: false });
    if (error) throw new Error(error.message);

    const { data: respuestas, error: error2 } = await supabase
      .from('respuestas')
      .select('id, publicacion_id, contenido, creado_en, usuario_id')
      .order('creado_en', { ascending: true });
    if (error2) throw new Error(error2.message);

    const ids = [...new Set([
      ...publicaciones.map((p) => p.usuario_id),
      ...respuestas.map((r) => r.usuario_id),
    ])];
    const { data: perfiles, error: error3 } = await supabase
      .from('perfiles')
      .select('id, nombre')
      .in('id', ids);
    if (error3) throw new Error(error3.message);
    const nombrePorId = Object.fromEntries(perfiles.map((p) => [p.id, p.nombre]));

    return publicaciones.map((pub) => ({
      id: pub.id,
      contenido: pub.contenido,
      autor: nombrePorId[pub.usuario_id],
      autor_id: pub.usuario_id,
      respuestas: respuestas
        .filter((r) => r.publicacion_id === pub.id)
        .map((r) => ({ id: r.id, contenido: r.contenido, autor: nombrePorId[r.usuario_id] })),
    }));
  },

  async crear(contenido) {
    const usuario = await authApi.usuarioActual();
    const { data, error } = await supabase
      .from('publicaciones')
      .insert({ contenido, usuario_id: usuario.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async borrar(id) {
    const { error } = await supabase.from('publicaciones').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async responder(publicacionId, contenido) {
    const usuario = await authApi.usuarioActual();
    const { data, error } = await supabase
      .from('respuestas')
      .insert({ publicacion_id: publicacionId, contenido, usuario_id: usuario.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};
