import { supabase } from './supabaseClient.js';

// Traduce mensajes de error de Supabase/Postgres a algo que un usuario entienda.
function traducirErrorRegistro(mensaje) {
  const m = (mensaje || '').toLowerCase();
  if (m.includes('already registered') || m.includes('already been registered')) {
    return 'Ya existe una cuenta con ese correo electrónico.';
  }
  if (m.includes('duplicate') || m.includes('unique')) {
    // Si no fue el correo (caso de arriba), es la carrera del nombre único
    // (dos registros casi simultáneos con el mismo nombre).
    return 'Ese nombre de usuario ya está en uso. Elige otro.';
  }
  if (m.includes('password')) {
    return 'La contraseña no cumple los requisitos mínimos de Supabase (revisa longitud).';
  }
  return mensaje;
}

export const authApi = {
  // Verifica disponibilidad del nombre ANTES de intentar crear la cuenta,
  // así el usuario recibe el error correcto en vez de un mensaje genérico.
  async nombreDisponible(nombre) {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id')
      .ilike('nombre', nombre.trim())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return !data;
  },

  async registrar({ nombre, email, password }) {
    const nombreLimpio = nombre.trim();
    const emailLimpio = email.trim().toLowerCase();

    const disponible = await this.nombreDisponible(nombreLimpio);
    if (!disponible) {
      throw new Error('Ese nombre de usuario ya está en uso. Elige otro.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: emailLimpio,
      password,
      options: { data: { nombre: nombreLimpio } },
    });
    // El índice único de la BD (lower(nombre)) es la garantía real contra
    // condiciones de carrera; si llega a fallar aquí, se traduce el mensaje.
    if (error) throw new Error(traducirErrorRegistro(error.message));
    return data; // data.session existe si "Confirm email" está desactivado
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