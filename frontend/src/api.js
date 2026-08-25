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
  async obtener() {
    const { data: publicaciones, error } = await supabase
      .from('publicaciones')
      .select('id, contenido, creado_en, usuario_id, perfiles(nombre)')
      .order('creado_en', { ascending: false });
    if (error) throw new Error(error.message);

    const { data: respuestas, error: error2 } = await supabase
      .from('respuestas')
      .select('id, publicacion_id, contenido, creado_en, perfiles(nombre)')
      .order('creado_en', { ascending: true });
    if (error2) throw new Error(error2.message);

    return publicaciones.map((pub) => ({
      id: pub.id,
      contenido: pub.contenido,
      autor: pub.perfiles?.nombre,
      autor_id: pub.usuario_id,
      respuestas: respuestas
        .filter((r) => r.publicacion_id === pub.id)
        .map((r) => ({ id: r.id, contenido: r.contenido, autor: r.perfiles?.nombre })),
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
