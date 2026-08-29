
-- Dashboard de Supabase -> SQL Editor -> New query -> pegar y Run.

create unique index if not exists perfiles_nombre_unico_idx
  on public.perfiles (lower(nombre));

-- Si este comando falla con "could not create unique index... duplicate key value"
-- significa que ya existen dos usuarios registrados con el mismo nombre (sin
-- distinguir mayúsculas/minúsculas). 