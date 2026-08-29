create table if not exists public.usuario (
  id bigint generated always as identity primary key,
  nombre varchar(100) not null,
  email varchar(150) unique not null,
  contraseña varchar(255) not null,
  edad integer,
  sexo varchar(20)
);

create table if not exists public.publicacion (
  id bigint generated always as identity primary key,
  usuario_id bigint not null references public.usuario(id) on delete cascade,
  titulo varchar(150) not null,
  contenido text,
  descripcion text,
  fecha date default current_date,
  estado boolean default true
);

create table if not exists public.comentario (
  id bigint generated always as identity primary key,
  usuario_id bigint not null references public.usuario(id) on delete cascade,
  publicacion_id bigint not null references public.publicacion(id) on delete cascade,
  texto text not null,
  fecha date default current_date,
  estado boolean default true
);

alter table public.usuario enable row level security;
alter table public.publicacion enable row level security;
alter table public.comentario enable row level security;

create policy "acceso abierto usuario" on public.usuario for all using (true) with check (true);
create policy "acceso abierto publicacion" on public.publicacion for all using (true) with check (true);
create policy "acceso abierto comentario" on public.comentario for all using (true) with check (true);