-- Ejecutar esto en Supabase: Dashboard -> SQL Editor -> New query -> Run

-- Tabla de perfiles (nombre visible del usuario, ligada a auth.users)
create table public.perfiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nombre text not null,
  creado_en timestamp default now()
);

-- HU01: el nombre de usuario debe ser único (sin distinguir mayúsculas/minúsculas,
-- para que "Juan" y "juan" cuenten como el mismo nombre)
create unique index perfiles_nombre_unico_idx on public.perfiles (lower(nombre));

-- Se crea el perfil automáticamente cuando alguien se registra
create function public.manejar_nuevo_usuario()
returns trigger as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, new.raw_user_meta_data->>'nombre');
  return new;
end;
$$ language plpgsql security definer;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute procedure public.manejar_nuevo_usuario();

-- Publicaciones
create table public.publicaciones (
  id bigint generated always as identity primary key,
  usuario_id uuid references auth.users(id) on delete cascade not null,
  contenido text not null,
  creado_en timestamp default now()
);

-- Respuestas
create table public.respuestas (
  id bigint generated always as identity primary key,
  publicacion_id bigint references public.publicaciones(id) on delete cascade not null,
  usuario_id uuid references auth.users(id) on delete cascade not null,
  contenido text not null,
  creado_en timestamp default now()
);

-- Row Level Security
alter table public.perfiles enable row level security;
alter table public.publicaciones enable row level security;
alter table public.respuestas enable row level security;

-- Lectura: cualquier usuario autenticado puede ver todo
create policy "Perfiles visibles" on public.perfiles for select using (true);
create policy "Publicaciones visibles" on public.publicaciones for select using (true);
create policy "Respuestas visibles" on public.respuestas for select using (true);

-- Escritura: solo el dueño puede crear/borrar lo suyo
create policy "Crear publicacion propia" on public.publicaciones for insert with check (auth.uid() = usuario_id);
create policy "Borrar publicacion propia" on public.publicaciones for delete using (auth.uid() = usuario_id);
create policy "Crear respuesta propia" on public.respuestas for insert with check (auth.uid() = usuario_id);